import React, { useState } from 'react'
import styled from 'styled-components'
import BookmarkCreateDialog from './BookmarkCreateDialog'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Card from '@mui/material/Card';
import { Button } from '@mui/material'

const BookmarksContainer = styled.div`
	display: flex;
`
const BookmarkCard = styled(Card)`
	padding: 16px;
	margin: 0 16px 16px 0;

`

function Bookmark ({ bookmarks }) {
	const [createDialogVisible, setCreateDialogVisible] = useState(true)
	console.log(bookmarks)
	const renderBookmark = (bookmark) => {
		return (
			<BookmarkCard>
				<div>{bookmark.title}</div>
				<div>{bookmark.link}</div>
				<div>{bookmark.description}</div>
				<div>
					{
						bookmark.uploads && bookmark.uploads[0] && (
							<img src={bookmark.uploads[0].preview}></img>
						)
					}
				</div>
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