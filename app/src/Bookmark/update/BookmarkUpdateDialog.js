import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, CircularProgress, Icon, IconButton, InputAdornment, TextField } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import ManageUploadsAndThumbnailPanel from './ManageUploadsAndThumbnailPanel'
import { firestoreConnect } from 'react-redux-firebase'
import { ContentCopy, Delete, Launch } from '@mui/icons-material'
import TagAddDialog, { TagItem, TagsSelectedContainer } from '../TagAddDialog'
import { Subtext } from '../../components/styledComponents/BasicComponents'
import StandardInputField from '../../components/inputs/StandardInputField'

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

function BookmarkUpdateDialog (props) {
	const { visible, bookmarkUUID, ordered, _setVisible, _updateBookmark, _deleteBookmark } = props
	const [updatedBookmark, setUpdatedBookmark ] = useState(null)
	const [tagAddDialogVisible, setTagAddDialogVisible] = useState(false)
	const [processing, setProcessing ] = useState(false)
	const { enqueueSnackbar } = useSnackbar();
	const fsBookmark = ordered[`bookmarkToUpdate-${bookmarkUUID}`]
	const bookmark = fsBookmark && fsBookmark[0]

	useEffect(()=>{
		if(bookmark) {
			if(!updatedBookmark) {
				setUpdatedBookmark(bookmark)
			} else {
				setUpdatedBookmark({...updatedBookmark, uploads: bookmark.uploads})
			}
		}
	},[bookmark])

	if(!updatedBookmark || !bookmark)
		return null

	const updateInputValue = (value) => {
		setUpdatedBookmark({...updatedBookmark, ...value})
	}

	const onBookmarkUpdate = async () => {
		if(processing)
			return 

		setProcessing(true)
		
		const response = await _updateBookmark(updatedBookmark, bookmark.uuid )

		if (response) {
			enqueueSnackbar('Successfully updated a bookmark', {variant: 'success'})
		} else {
			enqueueSnackbar('Something went wrong. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	const onBookmarkDelete = async () => {
		if(processing)
			return 

		setProcessing(true)
		const response = await _deleteBookmark( bookmark.uuid )

		if (response) {
			enqueueSnackbar('Successfully deleted bookmark', {variant: 'success'})
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
			dialogTitle={"Bookmark update"}
			dialogActions={[
				<Button variant="contained" onClick={onBookmarkUpdate}>{processing ? <CircularProgress style={{ color: '#fff' }} size={20} /> : 'Update'}</Button>
			]}
			rightTitleActions={[
				<IconButton onClick={onBookmarkDelete}>{processing ? <CircularProgress size={20}/> : <Delete style={{ color:'#fff' }}/>}</IconButton>
			]}
		>

			<StandardInputField
				label="Title" 
				inputMaxLength={300}
				value={updatedBookmark.title} 
				onChange={(event) => updateInputValue({title: event.target.value})} />
			<StandardInputField 
				label="Link" 
				inputMaxLength={700}
				InputProps={{
					endAdornment: (
					  <InputAdornment position="end">
						<ContentCopy style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => navigator.clipboard.writeText(bookmark.link)} />
						<a target='_blank' rel="noopener noreferrer" href={bookmark.link} style={{ display: 'flex', placeItems: 'center' }}><Launch /></a>
					  </InputAdornment>
					),
				  }}		  
				value={updatedBookmark.link} 
				onChange={(event) => updateInputValue({link: event.target.value})} />
			<StandardInputField 
				label="Description" 
				value={updatedBookmark.description}
				multiline
				rows={3}
				inputMaxLength={1500} 
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
						updatedBookmark?.tags && updatedBookmark.tags.length > 0 
							? updatedBookmark.tags.map(renderTag) 
							: <Subtext style={{ fontSize: '0.8em', fontStyle: 'italic' }}>No tags added yet.</Subtext>
					}	
				</TagsAddedContainer>
			</TagSection>

			<ManageUploadsAndThumbnailPanel 
				bookmarkUUID={bookmark.uuid}
				uploadLinks={updatedBookmark.uploads} 
				bookmarkThumbnail={updatedBookmark.thumbnail}
				_setThumbnail={(thumbnail)=>setUpdatedBookmark({ ...updatedBookmark, thumbnail })}
			/>
			{
				tagAddDialogVisible && (
					<TagAddDialog
						visible={tagAddDialogVisible}
						_setVisible={setTagAddDialogVisible}
						tagsInBookmark={updatedBookmark.tags}
						_updateTagsInBookmark={(value)=>updateInputValue({ tags: value })}
					/>
				)
			}
		</StandardDialog>
	)
}

const mapState = ({
	firestoreReducer: { ordered }
}) => ({
	ordered
})

const mapDispatchToProps = (dispatch) => ({
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
	_deleteBookmark: bindActionCreators(bookmarkActions._deleteBookmark, dispatch),
})

export default compose(
	firestoreConnect(({ bookmarkUUID }) => {
		return (
			[
				{
					collection: 'bookmark',
					where: [['uuid', '==', bookmarkUUID]],
					storeAs: `bookmarkToUpdate-${bookmarkUUID}`,
				},
			]
		)
	}),
	connect(mapState, mapDispatchToProps)
)(BookmarkUpdateDialog)