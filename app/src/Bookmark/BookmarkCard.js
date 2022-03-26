import React, { useState } from 'react'
import styled from 'styled-components'
import { Card } from '@material-ui/core'
import BookmarkUpdateDialog from './update/BookmarkUpdateDialog'
import { Button, Checkbox, Icon, Tooltip } from '@mui/material'
import truncate from 'truncate'
import moment from 'moment'
import { Subtext } from '../components/styledComponents/BasicComponents'
import { TagItem } from './Tags/TagListDisplay'

const imageHeight = 170
const cardHeight = 365
const contentHeight = cardHeight - imageHeight

const BookmarkTitle = styled.div`
	font-weight: 400;
	font-size: 1.3em;
	max-width: 290px;
    word-break: break-all;
	margin-bottom: 4px;
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
	margin-top: 8px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
`
const TagList = styled.div`
	display: flex;
	place-items: center;
	margin: 4px 0;
	max-width: 288px;
	overflow: hidden;
`
const AuthorTag = styled(TagItem)`
	padding: 4px;
	margin-right: 4px;
	font-size: 0.7em;
	color: #fff;
	background-color: #be1d29;
	border: none;
`
const BookmarkTag = styled(TagItem)`
	padding: 4px;
	margin-right: 4px;
	font-size: 0.7em;
`
const TagIcon = styled(Icon)`
	margin-right: 4px;
	font-size: 1em;
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

	const getHostnameFromLink = () => {
		if(!bookmark.link) {
			return <Subtext>No link provided</Subtext>
		}
		try {
			const { hostname } = new URL(bookmark.link)
			return <div>{hostname}</div>
		} catch (error) {
			return <Subtext>Invalid Link</Subtext>
		}		
	}

	const renderTagLists = () => {
		const authorTags = bookmark.tags?.filter((tag) => tag.type?.name === 'Author')
		const siteTags = bookmark.tags?.filter((tag) => tag.type?.name === 'Site')
		
		return (
			<div>
				<TagList>
					<Icon style={{ marginRight: 4, fontSize: '1em' }}>person</Icon>
					{
						authorTags.length > 0 
							? authorTags.map((tag)=><AuthorTag tagColor={"#98121b"} key={tag.uuid}>{tag.name}</AuthorTag>) 
							: <Subtext>Unknown</Subtext>
					}		
				</TagList>
				<TagList>
					<TagIcon>language</TagIcon>
					{
						siteTags.length > 0 
							? siteTags.map((tag)=><div key={tag.uuid}>{tag.name}</div>)
							: getHostnameFromLink()
					}	
				</TagList>
			</div>
		)
	}

	const renderTags = (tag) => {
		const tagTypeName = tag.type?.name
		if( tagTypeName && (tagTypeName === "Site" || tagTypeName === "Author")){
			return null
		}
		return (
			<BookmarkTag key={tag.uuid} tagColor={tag.color}>
				<TagIcon>{tag.type.icon}</TagIcon>
				{tag.name}
			</BookmarkTag>
		)
	}

	const handleUpdateOpenClick = () => {
		setBookmarkUUIDForUpdate(bookmark.uuid) 
		setUpdateDialogVisible(true)
	}

	const LinkWrapper = ({children}) => {
		const { link } = bookmark
		if(link) {
			let validLink = link
			if(!link.includes('https://') && !link.includes('http://')) {
				validLink = `http://${link}`
			}
			return (
				<a href={validLink} target="_blank" rel="noopener noreferrer" key={bookmark.uuid}>
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
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<Tooltip title={bookmark.title}>
									<BookmarkTitle>
										{bookmark.title ? truncate(bookmark.title, 30) : truncate(bookmark.link, 20)}
									</BookmarkTitle>
								</Tooltip>
							</div>
							<div>
								{
									renderTagLists()
								}
								<TagList>
									{bookmark.tags && bookmark.tags.map(renderTags)}
								</TagList>
							</div>
						</BookmarkInfo>
						<BookmarkActionsContainer>
							<Button
								onClick={(e) => {
									e.stopPropagation()
									e.preventDefault()
									handleUpdateOpenClick()
								}}
							>
								<Icon style={{ marginRight: 8 }}>edit_note</Icon> More details
							</Button>
							<div style={{ opacity: 0.8, fontSize: '0.8em' }}>
								<Tooltip title={'Created at'}><span>{moment(bookmark.createdAt).fromNow()}</span></Tooltip>
							</div>
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