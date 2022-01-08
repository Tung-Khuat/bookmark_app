import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, TextField } from '@mui/material'
import StandardDialog from '../../components/Dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../../state/actions/bookmarkActions'
import { useSnackbar } from 'notistack'
import { ManageUploadsAndThumbnailPanel } from './ManageUploadsAndThumbnailPanel'
import { firestoreConnect } from 'react-redux-firebase'
import WithLoadingUntilFirestoreLoaded from '../../components/HOC/WithLoadingUntilFirestoreLoaded'

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`

function BookmarkUpdateDialog (props) {
	const { visible, bookmarkUUID, ordered, _setVisible, _updateBookmark } = props
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

	if(!updatedBookmark)
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

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			title={"Bookmark update"}
			dialogActions={[
				<Button onClick={onBookmarkUpdate}>{processing ? 'Loading...' : 'Update'}</Button>
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