import { Button, CircularProgress } from '@mui/material'
import styled from 'styled-components'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { useSnackbar } from 'notistack'
import ImageDropzone from '../../components/ImageDropzone'
import * as bookmarkActions from '../../state/bookmarkState/bookmark-actions'

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

function AddUploadDialog({visible, _setVisible, bookmarkUUID, _updateBookmark, _upload}) {
	const [processing, setProcessing] = useState(false)
	const [uploadFiles, setUploadFiles ] = useState([])
	const { enqueueSnackbar } = useSnackbar();

	const uploadFilesAndSaveURL = async () => {
		setProcessing(true)
		
		try {
			//upload files
			const promises = uploadFiles.map((file)=>_upload({bookmarkUUID, file}))
			await Promise.all(promises)

			//update bookmark to get file urls and meta data
			await _updateBookmark({}, bookmarkUUID)

			enqueueSnackbar('Successfully created a bookmark', {variant: 'success'})
			setUploadFiles([])
		} catch (error) {
			enqueueSnackbar('Unable to update uploads.', {variant: 'error'})
		}	
					
		setProcessing(false)
		_setVisible(false)
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle="Add upload"
			dialogActions={[
				<Button 
					disabled={!uploadFiles || uploadFiles.length < 1} 
					onClick={uploadFilesAndSaveURL}>{processing ? <CircularProgress size={20} /> : 'Upload'}</Button>
			]}
		>
			{
				processing ? (
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
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
	_upload: bindActionCreators(bookmarkActions._upload, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps)
)(AddUploadDialog)