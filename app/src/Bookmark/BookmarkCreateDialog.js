import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CircularProgress, Icon, TextField } from '@mui/material'
import StandardDialog from '../components/dialogs/StandardDialog'
import ImageDropzone from '../components/ImageDropzone'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import WithDirectoryParentUUID from '../components/HOC/WithDirectoryParentUUID'
import { Subtext } from '../components/styledComponents/BasicComponents'
import TagAddDialog, { TagItem, TagsSelectedContainer } from './TagAddDialog'

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
const TagSection = styled.div`
	border: 1px solid #dbdbdb;
	border-radius: 8px;
	padding: 16px;
	padding-top: 8px;
	margin-bottom: 16px;
`
const TagSectionHeader = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	place-items: center;
	cursor: pointer;
	button {
		width: 200px;
		display: flex;
		place-items: center;
	}
`
const TagsAddedContainer = styled(TagsSelectedContainer)`
	height: 64px;
	margin: 8px 0;
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
	const { visible, directoryUUID, _setVisible, _createBookmark, _updateBookmark, _upload } = props
	const [bookmark, setBookmark] = useState(initialBookmarkState)
	const [uploadFiles, setUploadFiles] = useState([])
	const [processing, setProcessing] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [tagAddDialogVisible, setTagAddDialogVisible] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const updateInputValue = (value) => {
		setBookmark({...bookmark, ...value})
	}

	const onBookmarkCreate = async () => {
		if(processing)
			return 

		setProcessing(true)

		// create bookmark without uploads first
		const newBookmark = { ...bookmark, parentUUID: directoryUUID || null }
		const response = await _createBookmark(newBookmark)

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

	const renderTag = (tag) => {
		return (
			<TagItem tagColor={tag.color} style={{ marginRight: 8 }}>
				<Icon style={{ marginRight: 8 }}>{tag.type.icon}</Icon>
				<div>{tag.name}</div>
			</TagItem>
		)
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
				autoComplete='off'
				label="Title" 
				variant="outlined" 
				value={bookmark.title} 
				onChange={(event) => updateInputValue({title: event.target.value})} />
			<StyledInputField 
				autoComplete='off'
				label="Link" 
				variant="outlined" 
				value={bookmark.link} 
				onChange={(event) => updateInputValue({link: event.target.value})} />
			<StyledInputField 
				autoComplete='off'
				label="Description" 
				variant="outlined" 
				value={bookmark.description}
				rows={3} 
				multiline
				onChange={(event) => updateInputValue({description: event.target.value})} />

			<TagSection>
				<TagSectionHeader onClick={()=>setTagAddDialogVisible(true)}>
						<div style={{ fontSize: 20, width: '100%' }}>Tags</div>
						<Button 
							variant="outlined"
							onClick={()=>setTagAddDialogVisible(true)}
						>
							<Icon style={{ marginRight: 8 }}>app_registration</Icon> Modify List
						</Button>
				</TagSectionHeader>
				<TagsAddedContainer>
					{
						bookmark?.tags && bookmark.tags.length > 0 
							? bookmark.tags.map(renderTag) 
							: <Subtext style={{ fontSize: '0.8em', fontStyle: 'italic' }}>No tags added yet.</Subtext>
					}
				</TagsAddedContainer>
			</TagSection>
			{
				uploading ? (
					<DropzoneLoadingPlaceholder>
						<CircularProgress />
					</DropzoneLoadingPlaceholder>
				) : (
					<ImageDropzone _callbackOnDrop={(files) => setUploadFiles(files)} />
				)
			}
			{
				tagAddDialogVisible && (
					<TagAddDialog
						visible={tagAddDialogVisible}
						_setVisible={setTagAddDialogVisible}
						tagsInBookmark={bookmark.tags}
						_updateTagsInBookmark={(value)=>updateInputValue({ tags: value })}
					/>
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
	WithDirectoryParentUUID,
	connect(null, mapDispatchToProps)
)(BookmarkCreateDialog)