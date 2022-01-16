import React, { useState } from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'
import BookmarkUpdateDialog from './update/BookmarkUpdateDialog'
import { Checkbox, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import truncate from 'truncate'
import moment from 'moment'
import { ContentCopy, Edit, MoreVert } from '@mui/icons-material'

const BookmarkTitle = styled.div`
	font-weight: 400;
	font-size: 1.2em;
`
const BookmarkCardContainer = styled(Card)`
	margin: 0 16px 16px 0;
	width: 320px;
	height: 275px;
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
	height: 170px;
	background: url(${({url}) => url});
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`
const BookmarkInfo = styled.div`
	padding: 0 8px 16px 16px;
	margin-top: 8px;
	display: grid;
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
	const [anchorEl, setAnchorEl] = useState(null)


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
	const open = Boolean(anchorEl)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
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

	return (
		<a href={bookmark.link} key={bookmark.uuid} target="_blank">
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
						) : <div style={{height: 180}} />
					}
				<BookmarkInfo>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Tooltip title={bookmark.title}>
							<BookmarkTitle style={{margin: 0}}>
								{truncate(bookmark.title, 30)}
							</BookmarkTitle>
						</Tooltip>
						<div 
							onClick={(e)=>{
								e.preventDefault()
								e.stopPropagation()
								handleClick(e)
							}} 
							style={{cursor: 'pointer'}}
						>
							<MoreVert/>
						</div>
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
						>
							<MenuItem
								onClick={()=>{
									navigator.clipboard.writeText(bookmark.link)
								}}
							>
								<ListItemIcon>
									<ContentCopy fontSize="small" />
								</ListItemIcon>
								<ListItemText>Copy link</ListItemText>
							</MenuItem>
							<MenuItem
								onClick={handleUpdateOpenClick}
							>
								<ListItemIcon>
									<Edit fontSize="small" />
								</ListItemIcon>
								<ListItemText>Edit</ListItemText>
							</MenuItem>
						</Menu>
					</div>
					<div style={{ opacity: 0.8, fontSize: '0.8em' }}>{moment(bookmark.createdAt).fromNow()}</div>
					<div>{bookmark.tags && bookmark.tags.map(renderTags)}</div>
				</BookmarkInfo>
			</BookmarkCardContainer>
			{
				bookmarkUUIDForUpdate && updateDialogVisible && (
					<BookmarkUpdateDialog
						bookmarkUUID={bookmarkUUIDForUpdate} 
						visible={updateDialogVisible} 
						_setVisible={setUpdateDialogVisible} 
					/>
				)
			}
		</a>
	)
}