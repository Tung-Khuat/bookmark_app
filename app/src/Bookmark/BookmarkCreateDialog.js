import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, TextField } from '@mui/material'
import StandardDialog from '../components/Dialogs/StandardDialog'
import ImageDropzone from '../components/ImageDropzone'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../state/actions/bookmarkActions'
import { useSnackbar } from 'notistack'

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
	const { visible, _setVisible, _createBookmark } = props
	const [bookmark, setBookmark ] = useState(initialBookmarkState)
	const [processing, setProcessing ] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	useEffect(()=>{
	},[bookmark])

	const updateInputValue = (value) => {
		setBookmark({...bookmark, ...value})
	}
	const onBookmarkCreate = async () => {
		if(processing)
			return 

		setProcessing(true)
		const success = await _createBookmark(bookmark)

		if (success) {
			setBookmark(initialBookmarkState)
			enqueueSnackbar('Successfully created a bookmark', {variant: 'success'})
		} else {
			enqueueSnackbar('Something went wrong. Please try again later.', {variant: 'error'})
		}
		setProcessing(false)
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
			<ImageDropzone _callbackOnDrop={(files) => updateInputValue({ uploads: files })} />
		</StandardDialog>
	)
}

const mapState = ({
}) => ({
})

const mapDispatchToProps = (dispatch) => ({
	_createBookmark: bindActionCreators(bookmarkActions._createBookmark, dispatch),
})

export default compose(
	connect(mapState, mapDispatchToProps)
)(BookmarkCreateDialog)