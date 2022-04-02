import React, { useEffect, useState } from 'react'
import { CircularProgress, InputAdornment } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import ManageUploadsAndThumbnailPanel from './ManageUploadsAndThumbnailPanel'
import { firestoreConnect } from 'react-redux-firebase'
import { Launch } from '@mui/icons-material'
import StandardInputField from '../../components/inputs/StandardInputField'
import BookmarkTagsEditor from '../Tags/BookmarkTagsEditor'
import { ThemeButton } from '../../components/styledComponents/Buttons'
import { ThemeIcon } from '../../components/styledComponents/Icons'

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

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Bookmark update"}
			dialogActions={[
				<ThemeButton 
					variant="contained"
					highlightText 
					onClick={onBookmarkUpdate}
				>
					{processing ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Update'}
				</ThemeButton>
			]}
			rightTitleActions={[
				<div style={{ padding: 8, cursor: 'pointer', display: 'flex', placeItems: 'center' }} onClick={onBookmarkDelete}>
					{processing ? <CircularProgress size={24}/> : <ThemeIcon staticThemeB>delete</ThemeIcon>}
				</div>
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
						<ThemeIcon linkColor onClick={() => navigator.clipboard.writeText(bookmark.link)}>content_copy</ThemeIcon>
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

			<BookmarkTagsEditor tags={updatedBookmark.tags} _updateTags={(value)=>updateInputValue({ tags: value })} />

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