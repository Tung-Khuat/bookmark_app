import { AddCircle, Delete, Photo } from '@mui/icons-material'
import { Badge, IconButton } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import AddUploadDialog from './AddUploadDialog'
import { storage } from '../../state/store'
import { ref, deleteObject } from "firebase/storage";
import { useSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as bookmarkActions from '../../state/firebaseActions/bookmark-actions'

const PreviewsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, 75px);
	grid-gap: 8px;
	justify-content: center;
`
const Preview = styled.div`
	width: 75px;
	height: 45px;
	background: url(${({url}) => url});
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`
const PreviewBorder = styled.div`
	border: 3px solid ${(props) => props.highlighted ? props.theme.themeColors.highlight : 'transparent'};
`
const SpotlightContainer = styled.div`
	width: 100%;
	max-width: 750px;
	max-height: 450px;
	overflow: hidden;
	display: flex;
	place-items: center;
	justify-content: center;
	position: relative;
	margin: 16px auto;
`
const Spotlight = styled.img`
	width: 100%;
	height: 100%;
`
const SpotlightActions = styled.div`
	position: absolute;
	bottom: 16px;
	width: 100%;
	display: flex;
	justify-content: center;
`
const ActionButton = styled(IconButton)`
	background-color: rgb(0 0 0 / 40%);
	color: ${(props) => props.coloredIcon ? props.theme.themeColors.highlight : "#fff"} !important;
	margin-right: 8px;
	&:hover {
		background-color: ${(props) => props.theme.themeColors.highlight};
	}
`
const AddUploadButton = styled.div`
	cursor: pointer;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	opacity: 0.5;
	&:hover {
		color: ${(props) => props.theme.themeColors.highlight};
		opacity: 1;
	}
`
const ThemeBadge = styled(Badge)`
	span {
		background-color: ${(props) => props.isColored ? props.theme.themeColors.highlight : 'transparent'};
	}
`

function ManageUploadsAndThumbnailPanel ({uploadLinks, bookmarkThumbnail, _updateBookmark, _setThumbnail, bookmarkUUID}) {
	const [currentSpotlight, setCurrentSpotlight] = useState(bookmarkThumbnail || uploadLinks[0])
	const [addUploadDialogVisible, setAddUploadDialogVisible] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const renderPreviews = (preview, index) => {
		const { url } = preview
		const isBookmarkThumbnail = url === bookmarkThumbnail.url
		return (
			<ThemeBadge 
				key={index}
				badgeContent={isBookmarkThumbnail && <Photo style={{ fontSize: '1em', color: "fff" }} />}
				isColored={isBookmarkThumbnail}
			>
				<PreviewBorder highlighted={url === currentSpotlight?.url}>
					<Preview 
						url={url} 
						onClick={()=>setCurrentSpotlight(preview)} 
					/>
				</PreviewBorder>
			</ThemeBadge>
		)
	}

	const handleUploadDelete = (uploadFile) => {
		const confirmPrompt = window.confirm('Are you sure you want to delete this?')
		if(!confirmPrompt)
			return false
		
		const uploadFileRef = ref(storage, `bookmark-uploads/${bookmarkUUID}/${uploadFile.name}`)
		const spotlightIndex = uploadLinks.findIndex(u => u.url === currentSpotlight?.url)
		const nextUploadInPreview = uploadLinks[spotlightIndex + 1 < uploadLinks.length ? spotlightIndex +1 : 0]
		deleteObject(uploadFileRef).then(async () => {
			enqueueSnackbar(`Successfully deleted ${uploadFile.name} file`, {variant: 'success'})
			const updateUploadResponse = await _updateBookmark({
				uploads: uploadLinks.filter(upload => upload.url !== currentSpotlight?.url),
				thumbnail: currentSpotlight?.url === bookmarkThumbnail.url && nextUploadInPreview
			}, bookmarkUUID)
			if (updateUploadResponse) {
				enqueueSnackbar('Updated bookmark uploads successful', {variant: 'success'})
				setCurrentSpotlight(nextUploadInPreview)
			} else {
				enqueueSnackbar('Update book uploads failed. Please try again later.', {variant: 'error'})
			}

		}).catch((error) => {
			console.log(error)
			enqueueSnackbar('Failed to delete file.', {variant: 'error'})
		});

	}

	return (
		<div>
			<SpotlightContainer>
				<Spotlight src={currentSpotlight?.url} />
				<SpotlightActions>
					<ActionButton 
						onClick={()=>_setThumbnail(currentSpotlight)}
						disabled={currentSpotlight?.url === bookmarkThumbnail?.url} 
						coloredIcon={currentSpotlight?.url === bookmarkThumbnail?.url}
					>
						<Photo/>
					</ActionButton> 
					<ActionButton  onClick={()=>handleUploadDelete(currentSpotlight)}>
						<Delete/>
					</ActionButton> 
				</SpotlightActions>
			</SpotlightContainer>
			<PreviewsContainer>
				{uploadLinks?.map(renderPreviews)}
				<AddUploadButton onClick={()=>setAddUploadDialogVisible(true)}><AddCircle style={{ fontSize: '2em' }} /></AddUploadButton>
			</PreviewsContainer>
			<AddUploadDialog 
				visible={addUploadDialogVisible}
				_setVisible={setAddUploadDialogVisible}
				bookmarkUUID={bookmarkUUID}
			/>
		</div>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps)
)(ManageUploadsAndThumbnailPanel)