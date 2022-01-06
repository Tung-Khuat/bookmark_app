import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, TextField } from '@mui/material'
import StandardDialog from '../components/Dialogs/StandardDialog'
import ImageDropzone from '../components/ImageDropzone'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../state/actions/bookmarkActions'
import { useSnackbar } from 'notistack'
import { storage } from '../state/store'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import {
	renameFileWithSanitizedName,
} from '../utils/sanitizeFileName'

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`

const initialBookmarkState =  {
	title: "",
	description: "",
	link: "",
	thumbnail: "",
	uploads: [],
	tags: [],
	folder: null,
}

function BookmarkCreateDialog (props) {
	const { visible, _setVisible, _createBookmark, _updateBookmark } = props
	const [bookmark, setBookmark ] = useState(initialBookmarkState)
	const [uploadFiles, setUploadFiles ] = useState([])
	const [processing, setProcessing ] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const updateInputValue = (value) => {
		setBookmark({...bookmark, ...value})
	}
	const getRenamedFilesToIncludeBookmarkUUID = (files, bookmarkUUID) => {	
		const renamedFiles = files.map((file) => {
			const sanitizedFile = renameFileWithSanitizedName(file)
			const newFileName = `${bookmarkUUID};${sanitizedFile.name.replace(/ /g,"_")}`
			return new File([file], newFileName);
		})
		return renamedFiles
	}
	const onBookmarkCreate = async () => {
		if(processing)
			return 

		setProcessing(true)

		const response = await _createBookmark(bookmark)

		if (response) {
			uploadFilesAndUpdateBookmark(response.data)
			enqueueSnackbar('Successfully created a bookmark', {variant: 'success'})
		} else {
			enqueueSnackbar('Something went wrong. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	const uploadFilesAndUpdateBookmark = (bookmarkResponse) => {
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
				if(uploadFiles.length === uploadURLs.length){
					const updateUploadResponse = await _updateBookmark({
						uploads: uploadURLs,
						uuid: bookmarkResponse.uuid,
					})
					if (updateUploadResponse) {
						enqueueSnackbar('Upload successful', {variant: 'success'})
						setBookmark(initialBookmarkState)
					} else {
						enqueueSnackbar('Upload failed. Please try again later.', {variant: 'error'})
					}
				}
			});		  
		}

		if(uploadFiles && bookmarkResponse) {
			const renamedFiles = getRenamedFilesToIncludeBookmarkUUID(uploadFiles, bookmarkResponse.uuid)
			renamedFiles.forEach((file) => {
				const storageRef = ref(storage, `bookmark-uploads/${bookmarkResponse.uuid}/${file.name}`)
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
			title={"Bookmark create"}
			dialogActions={[
				<Button onClick={onBookmarkCreate}>{processing ? 'Loading...' : 'Create'}</Button>
			]}
		>
			<StyledInputField
				label="Title" 
				variant="outlined" 
				value={bookmark.title} 
				onChange={(event) => updateInputValue({title: event.target.value})} />
			<StyledInputField 
				label="Link" 
				variant="outlined" 
				value={bookmark.link} 
				onChange={(event) => updateInputValue({link: event.target.value})} />
			<StyledInputField 
				label="Description" 
				variant="outlined" 
				value={bookmark.description}
				rows={3} 
				multiline
				onChange={(event) => updateInputValue({description: event.target.value})} />
			<ImageDropzone _callbackOnDrop={(files) => setUploadFiles(files)} />
		</StandardDialog>
	)
}

const mapState = ({
}) => ({
})

const mapDispatchToProps = (dispatch) => ({
	_createBookmark: bindActionCreators(bookmarkActions._createBookmark, dispatch),
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
})

export default compose(
	connect(mapState, mapDispatchToProps)
)(BookmarkCreateDialog)