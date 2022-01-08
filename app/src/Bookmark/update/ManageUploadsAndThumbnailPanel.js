import { AddCircle, Delete, Photo } from '@mui/icons-material'
import { Badge, IconButton } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import AddUploadDialog from './AddUploadDialog'

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
	border: 3px solid transparent;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
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
	color: ${({coloredIcon}) => coloredIcon ? "#1776d1" : "#fff"} !important;
	margin-right: 8px;
	&:hover {
		background-color: #1776d1;
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
		color: #1776d1;
		opacity: 1;
	}
`

export function ManageUploadsAndThumbnailPanel ({uploadLinks, bookmarkThumbnail, _updateUploadLinks, _setThumbnail, bookmarkUUID}) {
	const [currentSpotlight, setCurrentSpotlight] = useState(bookmarkThumbnail || uploadLinks[0])
	const [addUploadDialogVisible, setAddUploadDialogVisible] = useState(false)
	const renderPreviews = (url) => {
		const isBookmarkThumbnail = url === bookmarkThumbnail
		return (
			<Badge 
				badgeContent={isBookmarkThumbnail && <Photo style={{ fontSize: '1em', color: "fff" }} />}
				color={isBookmarkThumbnail ? "primary" : undefined}
			>
				<Preview 
					url={url} 
					onClick={()=>setCurrentSpotlight(url)} 
					style={{ borderColor: url === currentSpotlight ? '#1776d1' : 'transparent'}}
				/>
			</Badge>
		)
	}
	return (
		<div>
			<SpotlightContainer>
				<Spotlight src={currentSpotlight} />
				<SpotlightActions>
					<ActionButton 
						onClick={()=>_setThumbnail(currentSpotlight)}
						disabled={currentSpotlight === bookmarkThumbnail} 
						coloredIcon={currentSpotlight === bookmarkThumbnail}
					>
						<Photo/>
					</ActionButton> 
					<ActionButton  onClick={()=>console.log("TODO: delete")}>
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
				existingUploads={uploadLinks}
			/>
		</div>
	)
}

