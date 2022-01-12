import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CircularProgress, TextField } from '@mui/material'
import StandardDialog from '../components/dialogs/StandardDialog'
import ImageDropzone from '../components/ImageDropzone'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`
const DropzoneLoadingPlaceholder = styled.div`
	width: 100%;
	height: 200px;
	border-radius: 8px;
	background-color: #fafafa;
	border: 2px dashed #dbdbdb; 
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
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
	const { visible, _setVisible, _createBookmark, _updateBookmark, _upload } = props
	const [bookmark, setBookmark ] = useState(initialBookmarkState)
	const [uploadFiles, setUploadFiles ] = useState([])
	const [processing, setProcessing ] = useState(false)
	const [uploading, setUploading ] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const updateInputValue = (value) => {
		setBookmark({...bookmark, ...value})
	}

	const onBookmarkCreate = async () => {
		if(processing)
			return 

		setProcessing(true)
		// create bookmark without uploads first
		const response = await _createBookmark(bookmark)

		if (response) {
			try {
				const bookmarkUUID = response.data.uuid
				//upload files
				setUploading(true)
				const promises = uploadFiles.map((file)=>_upload({bookmarkUUID, file}))
				await Promise.all(promises)
				setUploading(false)

				//update bookmark to get file urls and meta data
				await _updateBookmark({}, bookmarkUUID)

				enqueueSnackbar('Successfully created a bookmark', {variant: 'success'})
				setBookmark(initialBookmarkState)
				setUploadFiles([])
			} catch (error) {
				enqueueSnackbar('Unable to update uploads.', {variant: 'error'})
			}
		} else {
			enqueueSnackbar('Something went wrong. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Bookmark create"}
			dialogActions={[
				<Button onClick={onBookmarkCreate}>{processing ? <CircularProgress size={20} /> : 'Create'}</Button>
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
			
			{
				uploading ? (
					<DropzoneLoadingPlaceholder>
						<CircularProgress />
					</DropzoneLoadingPlaceholder>
				) : (
					<ImageDropzone _callbackOnDrop={(files) => setUploadFiles(files)} />
				)
			}
		</StandardDialog>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_createBookmark: bindActionCreators(bookmarkActions._createBookmark, dispatch),
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
	_upload: bindActionCreators(bookmarkActions._upload, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps)
)(BookmarkCreateDialog)