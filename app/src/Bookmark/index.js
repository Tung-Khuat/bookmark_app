import React, { useState } from 'react'
import styled from 'styled-components'
import { firestoreConnect } from 'react-redux-firebase'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Checkbox, CircularProgress, Fab, Tooltip, Card } from '@mui/material'
import { Add, ContentCopy, CreateNewFolder, Delete } from '@mui/icons-material'
import * as bookmarkActions from '../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import moment from 'moment'
import truncate from 'truncate'
import RouteHeader from '../components/viewLayouts/RouteHeader'
import BookmarkCreateDialog from './BookmarkCreateDialog'
import BookmarkUpdateDialog from './update/BookmarkUpdateDialog'
import WithLoggedInUser from '../components/HOC/auth/WithLoggedInUser'
import DirectoryCreateDialog from './Directory/DirectoryCreateDialog'
import Directory from './Directory'
import WithRouterHooks  from '../components/HOC/WithRouterHooks'
import WithDirectoryParentUUID from '../components/HOC/WithDirectoryParentUUID'
import { cacheDirectory } from '../state/appState/appActions'

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
	padding: 0 16px;
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
const SelectModePanel = styled.div`
	display: grid;
	grid-template-columns: 1fr auto auto;
	padding: 16px 0;
	width: 100%;
	justify-content: end;
	place-items: center;
`
const SelectModeLeftContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	margin-right: 16px;
	place-items: center;
	div {
		display: flex;
		place-items: center;
	}
`
const PathLink = styled.span`
	cursor: pointer;
  	color: ${(props) => props.theme.primary || '#1976d2'};
`
const UnderlineText = styled.span`
	text-decoration: underline;
`

function Bookmark (props) {
	const { bookmarks, loggedInUser, router, paramList, directoriesCached, _deleteBookmark } = props
	const [createBookmarkDialogVisible, setCreateBookmarkDialogVisible] = useState(false)
	const [createDirectoryDialogVisible, setCreateDirectoryDialogVisible] = useState(false)
	const [updateDialogVisible, setUpdateDialogVisible] = useState(false)
	const [bookmarkUUIDForUpdate, setBookmarkUUIDForUpdate] = useState(null)
	const [selectMode, setSelectMode] = useState(false)
	const [selectedBookmarkUUIDs, setSelectedBookmarkUUIDs] = useState([])
	const [processing, setProcessing] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const handleDeleteSelected = async () => {
		const confirm = window.confirm(`Are you sure you want to delete these (${selectedBookmarkUUIDs.length})bookmarks`)
		if(confirm) {
			setProcessing(true)
			const promises = selectedBookmarkUUIDs.map(uuid => {
				return _deleteBookmark(uuid)
			})
			try {
				await Promise.all(promises)
				setSelectedBookmarkUUIDs([])
				enqueueSnackbar('Successfully deleted selected bookmarks', {variant: 'success'})
			} catch (error) {
				console.log(error)
			}
			setProcessing(false)
		}
	}

	const renderTags = (tag) => {
		return (
			<div>{tag.label}</div>
		)
	}
	const renderSelectModePanel = () => {
		if(!bookmarks)
			return null
			
		const allBookmarkUUIDs = bookmarks.map((bookmark)=> bookmark.uuid)

		if(selectMode){
			return (
				<SelectModePanel>
					<SelectModeLeftContainer>
						<div>
							<Button 
								disabled={!selectedBookmarkUUIDs.length || processing}
								variant='outlined' 
								color='error' 
								onClick={handleDeleteSelected}>{processing ? <CircularProgress size={20} /> : (<><Delete />  Delete selected</>)} </Button>
						</div>
						<div style={{ marginRight: 16 }}>
							<Checkbox 
								checked={Boolean(selectedBookmarkUUIDs.length === bookmarks.length)}
								onClick={() => setSelectedBookmarkUUIDs(selectedBookmarkUUIDs.length === bookmarks.length ? [] : allBookmarkUUIDs)} 
							/> Select All
						</div>
						<div>{`${selectedBookmarkUUIDs?.length} selected`}</div>
					</SelectModeLeftContainer>
					<Button 
						style={{ marginRight: 16 }}
						onClick={()=>setSelectMode(false)}
						variant="contained"
					>Cancel select mode</Button>
				</SelectModePanel>
			)
		}
		return (
			<SelectModePanel>
				<div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
					<Button 
						style={{ marginLeft: 32 }} 
						onClick={()=>setCreateDirectoryDialogVisible(true)} 
						variant="outlined"
					>
						<CreateNewFolder style={{ marginRight: 8 }} /> New Folder
					</Button>
				</div>
				<SelectModeLeftContainer>
					<div>{`${bookmarks.length} bookmarks`}</div>
				</SelectModeLeftContainer>
				<Button 
					style={{ marginRight: 16 }}
					onClick={()=>setSelectMode(true)}
					variant="outlined"
				>Select mode</Button>
			</SelectModePanel>
		)
	}
	const renderBookmark = (bookmark) => {
		const isBookmarkChecked = Boolean(selectedBookmarkUUIDs.find(uuid => uuid === bookmark.uuid))
		const handleCheckboxClick = (e) => {
			e.preventDefault()
			e.stopPropagation()
			const matchingUUID = selectedBookmarkUUIDs.find(uuid => uuid === bookmark.uuid)
			if(matchingUUID){
				const filteredSelected = [...selectedBookmarkUUIDs].filter( uuid => uuid !== bookmark.uuid)
				setSelectedBookmarkUUIDs(filteredSelected)
			} else {
				setSelectedBookmarkUUIDs([...selectedBookmarkUUIDs, bookmark.uuid])
			}

		}
		return (
			<BookmarkCard 
				key={bookmark.uuid}
				onClick={()=>{setBookmarkUUIDForUpdate(bookmark.uuid); setUpdateDialogVisible(true)}}>
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

	const renderSubheader = () => {
		if(!loggedInUser)
			return null
		
		const { displayName, email } = loggedInUser
		const navigateToPath = (directoryUUID) => {
			const currentPath = router.location.pathname
			const newPath = currentPath.substr(0, currentPath.indexOf(`${directoryUUID}`) + directoryUUID.length);
			router.navigate(newPath)
		}
		const getDirectoryName = (directoryUUID) => {
			const matchingDirectory = directoriesCached && directoriesCached.find(d => d.uuid === directoryUUID)
			if (matchingDirectory){
				return matchingDirectory.name
			}
			return directoryUUID
		}
		
		return (
			<>
				<PathLink onClick={ () => navigateToPath('') }> 
					<UnderlineText>{displayName || email}</UnderlineText> /
				</PathLink>
				{
					paramList && paramList.map((uuid)=>(
						<PathLink key={uuid} onClick={ () => navigateToPath(uuid) }>
							<UnderlineText> {getDirectoryName(uuid)}</UnderlineText> /
						</PathLink>
					)) 
				}
			</>
		)
	}
	return (
		<div>
			<RouteHeader header={"Bookmarks"} subheader={renderSubheader()} />
			{
				renderSelectModePanel()
			}
			<Directory />
			<BookmarksContainer>
				{ bookmarks ? bookmarks.map(renderBookmark) : <div>No Bookmarks found</div> }
			</BookmarksContainer>
			<Fab 
				size="medium" color="primary" aria-label="add"
				style={{ position: 'fixed', bottom: 34, right: 34 }}
				onClick={()=>setCreateBookmarkDialogVisible(true)}	
			>
				<Add />
			</Fab>

			<BookmarkCreateDialog visible={createBookmarkDialogVisible} _setVisible={setCreateBookmarkDialogVisible} />
			{
				createDirectoryDialogVisible && (
					<DirectoryCreateDialog 
						visible={createDirectoryDialogVisible} 
						_setVisible={setCreateDirectoryDialogVisible} 
					/>
				)
			}
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
	firestoreReducer: { ordered: { bookmarks } },
	app: { directoriesCached },
}) => ({
	bookmarks,
	directoriesCached,
})

const mapDispatchToProps = (dispatch) => ({
	_deleteBookmark: bindActionCreators(bookmarkActions._deleteBookmark, dispatch),
})

export default compose(
	WithLoggedInUser,
	WithRouterHooks,
	WithDirectoryParentUUID,
	firestoreConnect(({ loggedInUser, directoryUUID }) => {
		return (
			[
				{
					collection: 'bookmark',
					where: [
						['authorUID', '==', loggedInUser?.uid || ''],
						directoryUUID ? ['parentUUID', '==' , directoryUUID] : ['parentUUID', '==' , null ] ,
					].filter(t=>t),
					storeAs: 'bookmarks',
				},
			]
		)
	}),
	connect(mapState, mapDispatchToProps)
)(Bookmark)