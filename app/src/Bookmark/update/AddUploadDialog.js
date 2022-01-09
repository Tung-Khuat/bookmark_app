import { Button } from '@mui/material'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import StandardDialog from '../../components/Dialogs/StandardDialog'
import { useSnackbar } from 'notistack'
import { storage } from '../../state/store'
import { getDownloadURL, ref, uploadBytesResumable, listAll, getMetadata } from "firebase/storage"
import {
	renameFileWithSanitizedName,
} from '../../utils/sanitizeFileName'
import ImageDropzone from '../../components/ImageDropzone'
import * as bookmarkActions from '../../state/actions/bookmarkActions'

function AddUploadDialog({visible, _setVisible, bookmarkUUID, _updateBookmark}) {
	const [processing, setProcessing] = useState(false)
	const [uploadFiles, setUploadFiles ] = useState([])
	const { enqueueSnackbar } = useSnackbar();

	const getSanitizedNameFiles = (files) => {	
		const renamedFiles = files.map((file) => {
			const sanitizedFile = renameFileWithSanitizedName(file)
			const newFileName = sanitizedFile.name.replace(/ /g,"_")
			return new File([file], newFileName);
		})
		return renamedFiles
	}

	const uploadFilesAndSaveURL = () => {
		let filesUploadedCount = 0
		setProcessing(true)
		const onSnapshot = (snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			console.log('Upload is ' + progress + '% done')
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused')
					break
				case 'running':
					console.log('Upload is running')
					break
				default:
					break
			}
		}
		const onUploadComplete = async (uploadTask) => {
			enqueueSnackbar(`Uploaded ${uploadTask._metadata.name}`, {variant: 'success'})
			filesUploadedCount++
			if(uploadFiles.length === filesUploadedCount){
				const bookmarkFileListRef = ref(storage, `bookmark-uploads/${bookmarkUUID}`)
				const uploadsInStorage = []
				listAll(bookmarkFileListRef)
					.then((res) => {
						res.prefixes.forEach((folderRef) => {
						// All folders under ref.
						})
						res.items.forEach((fileRef) => {
						// All files under ref.
							getDownloadURL(fileRef).then(async (url) => {
								const fileMetaData = await getMetadata(fileRef)
								const { name, timeCreated } = fileMetaData
								uploadsInStorage.push({
									url,
									name,
									createdAt: timeCreated,
								})
								if(res.items.length === uploadsInStorage.length) {
									const updateUploadResponse = await _updateBookmark({
										uploads: uploadsInStorage,
									}, bookmarkUUID)
									if (updateUploadResponse) {
										enqueueSnackbar('Updated bookmark uploads successful', {variant: 'success'})
									} else {
										enqueueSnackbar('Update book uploads failed. Please try again later.', {variant: 'error'})
									}
									setProcessing(false)
									_setVisible(false)
								}
							})  
						})
					}).catch((error) => {
						console.log(error)
					})				
			}
		}

		if(uploadFiles && bookmarkUUID) {
			const renamedFiles = getSanitizedNameFiles(uploadFiles, bookmarkUUID)
			renamedFiles.forEach((file) => {
				const storageRef = ref(storage, `bookmark-uploads/${bookmarkUUID}/${file.name}`)
				const uploadTask = uploadBytesResumable(storageRef, file)
				uploadTask.on(
					"state_changed",
					onSnapshot,
					error => enqueueSnackbar(error, {variant: 'error'}),
					()=>onUploadComplete(uploadTask),
				)
			})
		}
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle="Add upload"
			dialogActions={[
				<Button 
					disabled={!uploadFiles || uploadFiles.length < 1} 
					onClick={uploadFilesAndSaveURL}>{processing ? 'Loading...' : 'Upload'}</Button>
			]}
		>
			<ImageDropzone _callbackOnDrop={(files) => setUploadFiles(files)} />
		</StandardDialog>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps)
)(AddUploadDialog)