import React, { useState } from 'react'
import styled from 'styled-components'
import BookmarkCreateDialog from './BookmarkCreateDialog'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Card from '@mui/material/Card'
import { Button, Tooltip } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import moment from 'moment'
import BookmarkUpdateDialog from './update/BookmarkUpdateDialog'

const BookmarksContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, 320px);
	grid-gap: 16px;
	justify-content: center;
`
const BookmarkTitle = styled.div`
	font-weight: 400;
	font-size: 1.2em;
`
const BookmarkCard = styled(Card)`
	margin: 0 16px 16px 0;
	width: 320px;
	height: 275px;
	box-shadow: 0 20px 10px -15px rgb(197 192 249 / 20%);
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
	padding: 0 16px;
	margin-top: 8px;
	display: grid;
`

function Bookmark ({ bookmarks }) {
	const [createDialogVisible, setCreateDialogVisible] = useState(false)
	const [updateDialogVisible, setUpdateDialogVisible] = useState(false)
	const [bookmarkUUIDForUpdate, setBookmarkUUIDForUpdate] = useState(null)

	const renderTags = (tag) => {
		return (
			<div>{tag.label}</div>
		)
	}
	const renderBookmark = (bookmark) => {
		return (
			<BookmarkCard 
				key={bookmark.uuid}
				onClick={()=>{setBookmarkUUIDForUpdate(bookmark.uuid); setUpdateDialogVisible(true)}}>
					{
						bookmark.thumbnail ? (
							<Thumbnail url={bookmark.thumbnail.url} />
						) : <div style={{height: 180}} />
					}
				<BookmarkInfo>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Tooltip title={bookmark.link}><BookmarkTitle style={{margin: 0}}>{bookmark.title}</BookmarkTitle></Tooltip>
						<Tooltip 
							title={bookmark.link || 'No link provided'} 
							onClick={(e)=>{
								e.preventDefault()
								e.stopPropagation()
								navigator.clipboard.writeText(bookmark.link)
							}}
							style={{
								cursor: 'pointer',
								fontSize: '1.1em',
							}}
						><ContentCopy/></Tooltip>
					</div>
					<div style={{ opacity: 0.8, fontSize: '0.8em' }}>{moment(bookmark.createdAt).fromNow()}</div>
					<div>{bookmark.tags && bookmark.tags.map(renderTags)}</div>
				</BookmarkInfo>
			</BookmarkCard>
		)
	}

	return (
		<div>
			<Button onClick={()=>setCreateDialogVisible(true)}>Add Bookmark</Button>
			<BookmarksContainer>
				{ bookmarks ? bookmarks.map(renderBookmark) : <div>No Bookmarks found</div> }
			</BookmarksContainer>
			<BookmarkCreateDialog visible={createDialogVisible} _setVisible={setCreateDialogVisible} />
			{
				bookmarkUUIDForUpdate && updateDialogVisible && (
					<BookmarkUpdateDialog 
						bookmarkUUID={bookmarkUUIDForUpdate} 
						visible={updateDialogVisible} 
						_setVisible={setUpdateDialogVisible} 
					/>
				)
			}
		</div>
	)
}

const mapState = ({
	firestoreReducer: { ordered: { bookmarks } }
}) => ({
	bookmarks
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	firestoreConnect(({ authorUUID }) => [
		{
			collection: 'bookmark',
			// where: [['uuid', '==', queryParams.uuid || null]],
			storeAs: 'bookmarks',
		},
	]),
	connect(mapState, mapDispatchToProps)
)(Bookmark)