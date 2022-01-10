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

	const uploadFilesAndSaveURL = async () => {
		setProcessing(true)
		const uploadsInStorage = []

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
			console.log(`%cUploaded ${uploadTask._metadata.name}`, 'color: green')
		}

		if(uploadFiles && bookmarkUUID) {
			const renamedFiles = getSanitizedNameFiles(uploadFiles, bookmarkUUID)
			const uploadPromises = []
			// Upload starts
			renamedFiles.forEach((file) => {
				const storageRef = ref(storage, `bookmark-uploads/${bookmarkUUID}/${file.name}`)
				const uploadTask = uploadBytesResumable(storageRef, file)
				uploadTask.on(
					"state_changed",
					onSnapshot,
					error => enqueueSnackbar(error, {variant: 'error'}),
					()=> onUploadComplete(uploadTask),
				)
			})
			try {
				await Promise.all(uploadPromises)
				// Finished uploading, now getting download urls
				const bookmarkFileListRef = ref(storage, `bookmark-uploads/${bookmarkUUID}`)
				const fileList = await listAll(bookmarkFileListRef)
				const urlFetchPromises = []
				for(let fileRef of fileList.items) {
					urlFetchPromises.push(getDownloadURL(fileRef).then(async (url) => {
						const fileMetaData = await getMetadata(fileRef)
						const { name, timeCreated } = fileMetaData
						uploadsInStorage.push( {
							url,
							name,
							createdAt: timeCreated,
						})
					}))
				}
				await Promise.all(urlFetchPromises)	
				enqueueSnackbar(`All Uploads successful `, {variant: 'success'})
				const updateUploadResponse = await _updateBookmark({
					uploads: uploadsInStorage,
				}, bookmarkUUID)
				if (updateUploadResponse) {
					enqueueSnackbar('Updated bookmark uploads', {variant: 'success'})
				} else {
					enqueueSnackbar('Update book uploads failed. Please try again later.', {variant: 'error'})
				}
				setProcessing(false)
				_setVisible(false)
			} catch (error) {
				enqueueSnackbar(`Not all uploads passed`, {variant: 'error'})
			}
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