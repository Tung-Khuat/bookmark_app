import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, CircularProgress, IconButton, TextField } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import ManageUploadsAndThumbnailPanel from './ManageUploadsAndThumbnailPanel'
import { firestoreConnect } from 'react-redux-firebase'
import { Delete } from '@mui/icons-material'
import { storage } from '../../state/store'
import { ref, deleteObject, listAll } from "firebase/storage"


const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`

function BookmarkUpdateDialog (props) {
	const { visible, bookmarkUUID, ordered, _setVisible, _updateBookmark, _deleteBookmark } = props
	const [updatedBookmark, setUpdatedBookmark ] = useState(null)
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
		setUpdatedBookmark({...bookmark, ...value})
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

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Bookmark update"}
			dialogActions={[
				<Button onClick={onBookmarkUpdate}>{processing ? <CircularProgress size={20} /> : 'Update'}</Button>
			]}
			rightTitleActions={[
				<IconButton onClick={onBookmarkDelete}>{processing ? <CircularProgress size={20}/> : <Delete style={{ color:'#fff' }}/>}</IconButton>
			]}
		>
			<StyledInputField
				label="Title" 
				variant="outlined" 
				value={updatedBookmark.title} 
				onChange={(event) => updateInputValue({title: event.target.value})} />
			<StyledInputField 
				label="Link" 
				variant="outlined" 
				value={updatedBookmark.link} 
				onChange={(event) => updateInputValue({link: event.target.value})} />
			<StyledInputField 
				label="Description" 
				variant="outlined" 
				value={updatedBookmark.description}
				rows={3} 
				multiline
				onChange={(event) => updateInputValue({description: event.target.value})} />
			<ManageUploadsAndThumbnailPanel 
				bookmarkUUID={bookmark.uuid}
				uploadLinks={updatedBookmark.uploads} 
				bookmarkThumbnail={updatedBookmark.thumbnail}
				_setThumbnail={(thumbnail)=>setUpdatedBookmark({ ...updatedBookmark, thumbnail })}
			/>
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