import { Button } from '@mui/material'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import StandardDialog from '../../components/Dialogs/StandardDialog'
import { useSnackbar } from 'notistack'
import { storage } from '../../state/store'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import {
	renameFileWithSanitizedName,
} from '../../utils/sanitizeFileName'
import ImageDropzone from '../../components/ImageDropzone'
import * as bookmarkActions from '../../state/actions/bookmarkActions'

function AddUploadDialog({visible, _setVisible, bookmarkUUID, existingUploads, _updateBookmark}) {
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
		const uploadURLs = []
		const onSnapshot = (snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		}
		const onUploadComplete = (uploadTask) => {
			getDownloadURL(uploadTask.snapshot.ref).then( async (url) => {
				uploadURLs.push(url)
				enqueueSnackbar(`Uploaded ${uploadTask.snapshot.ref}`, {variant: 'success'})
				if(uploadFiles.length === uploadURLs.length){
					const updateUploadResponse = await _updateBookmark({
						uploads: [...existingUploads, ...uploadURLs],
					}, bookmarkUUID)
					if (updateUploadResponse) {
						enqueueSnackbar('Updated bookmark uploads successful', {variant: 'success'})
					} else {
						enqueueSnackbar('Update book uploads failed. Please try again later.', {variant: 'error'})
					}
				}
			});		  
		}

		if(uploadFiles && bookmarkUUID) {
			const renamedFiles = getSanitizedNameFiles(uploadFiles, bookmarkUUID)
			renamedFiles.forEach((file) => {
				const storageRef = ref(storage, `bookmark-uploads/${bookmarkUUID}/${file.name}`)
				const uploadTask = uploadBytesResumable(storageRef, file)
				uploadTask.on(
					"state_changed",
					onSnapshot,
					error => console.log(error),
					()=>onUploadComplete(uploadTask),
				)
			})
		}
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			title="Add upload"
			dialogActions={[
				<Button onClick={uploadFilesAndSaveURL}>{processing ? 'Loading...' : 'Upload'}</Button>
			]}
		>
			<ImageDropzone _callbackOnDrop={(files) => setUploadFiles(files)} />
		</StandardDialog>
	)
}

const mapState = ({
}) => ({
})

const mapDispatchToProps = (dispatch) => ({
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
})

export default compose(
	connect(mapState, mapDispatchToProps)
)(AddUploadDialog)