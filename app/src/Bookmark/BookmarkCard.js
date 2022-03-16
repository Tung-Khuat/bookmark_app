import React, { useState } from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'
import BookmarkUpdateDialog from './update/BookmarkUpdateDialog'
import { Button, Checkbox, Tooltip } from '@mui/material'
import truncate from 'truncate'
import moment from 'moment'
import { ContentCopy, Edit, MoreVert } from '@mui/icons-material'

const imageHeight = 170
const cardHeight = 340
const contentHeight = cardHeight - imageHeight

const BookmarkTitle = styled.div`
	font-weight: 400;
	font-size: 1.2em;
`
const BookmarkCardContainer = styled(Card)`
	margin: 0 16px 16px 0;
	width: 320px;
	height: ${cardHeight + 'px'};
	box-shadow: 0 20px 10px -15px rgb(197 192 249 / 20%);
	position: relative;
	cursor: pointer;
	&:hover {
		box-shadow: 0 20px 10px -15px rgb(95 98 214 / 20%);
		transform: scale(1.03);
		transition: all 0.3s ease-in-out;
	}
`
const Thumbnail = styled.div`
	width: 100%;
	height: ${imageHeight + 'px'};
	background: url(${({url}) => url});
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`
const BookmarkContent = styled.div`
	padding: 0 16px;
	display: grid;
	grid-template-rows: 1fr auto;
	height: ${contentHeight + 'px'};
`
const BookmarkInfo = styled.div`
	margin: 8px 0;
`
const BookmarkActionsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	place-items: center;
	margin: 8px 0;
`
const BookmarkSelectCheckbox = styled(Checkbox)`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 2;
	background-color: #ffffff94;
    padding: 4px;
    border-radius: 0 0 0 8px;
	&:hover {
		background-color: #fff;
	}
`
export default function BookmarkCard({bookmark, selectMode, selectedBookmarkUUIDs, _setSelectedBookmarkUUIDs}) {
	const [updateDialogVisible, setUpdateDialogVisible] = useState(false)
	const [bookmarkUUIDForUpdate, setBookmarkUUIDForUpdate] = useState(null)

	const isBookmarkChecked = Boolean(selectedBookmarkUUIDs.find(uuid => uuid === bookmark.uuid))
	const handleCheckboxClick = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const matchingUUID = selectedBookmarkUUIDs.find(uuid => uuid === bookmark.uuid)
		if(matchingUUID){
			const filteredSelected = [...selectedBookmarkUUIDs].filter( uuid => uuid !== bookmark.uuid)
			_setSelectedBookmarkUUIDs(filteredSelected)
		} else {
			_setSelectedBookmarkUUIDs([...selectedBookmarkUUIDs, bookmark.uuid])
		}
	}

	const renderTags = (tag) => {
		return (
			<div key={tag.label}>{tag.label}</div>
		)
	}

	const handleUpdateOpenClick = () => {
		setBookmarkUUIDForUpdate(bookmark.uuid) 
		setUpdateDialogVisible(true)
	}

	const LinkWrapper = ({children}) => {
		const { link } = bookmark
		const copyToClipboard = navigator.clipboard.writeText(bookmark.link)
		if(link) {
			let validLink = link
			if(!link.includes('https://') && !link.includes('http://')) {
				validLink = `http://${link}`
			}
			return (
				<a href={validLink} target="_blank" key={bookmark.uuid}>
					{children}
				</a>
			)
		}

		return (
			<div 
				key={bookmark.uuid}
				style={{ cursor: 'pointer' }} 
				onClick={handleUpdateOpenClick} 
			>
				{children}
			</div>
		)
	}

	return (
		<>
			<LinkWrapper>		
				<BookmarkCardContainer>
					{
						selectMode && (
							<BookmarkSelectCheckbox 
								onClick={handleCheckboxClick}
								checked={isBookmarkChecked}
							/>
						)
					}
					{
						bookmark.thumbnail ? (
							<Thumbnail url={bookmark.thumbnail.url} />
						) : <div style={{height: imageHeight}} />
					}
					<BookmarkContent>
						<BookmarkInfo>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Tooltip title={bookmark.title}>
									<BookmarkTitle style={{margin: 0}}>
										{truncate(bookmark.title, 30)}
									</BookmarkTitle>
								</Tooltip>
							</div>
							<div>{bookmark.tags && bookmark.tags.map(renderTags)}</div>
						</BookmarkInfo>
						<BookmarkActionsContainer>
							<Button
								onClick={(e) => {
									e.stopPropagation()
									e.preventDefault()
									handleUpdateOpenClick()
								}}
							>
								<Edit style={{ marginRight: 8 }} /> Edit
							</Button>
							<div style={{ opacity: 0.8, fontSize: '0.8em' }}>{moment(bookmark.createdAt).fromNow()}</div>
						</BookmarkActionsContainer>
					</BookmarkContent>
				</BookmarkCardContainer>
			</LinkWrapper>
			{
				bookmarkUUIDForUpdate && updateDialogVisible && (
					<BookmarkUpdateDialog
						bookmarkUUID={bookmarkUUIDForUpdate} 
						visible={updateDialogVisible} 
						_setVisible={setUpdateDialogVisible} 
					/>
				)
			}
		</>
	)
}