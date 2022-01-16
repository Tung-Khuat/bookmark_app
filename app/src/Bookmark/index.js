import React, { useState } from 'react'
import styled from 'styled-components'
import { firestoreConnect } from 'react-redux-firebase'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Checkbox, CircularProgress, Fab } from '@mui/material'
import { Add, CreateNewFolder, Delete, Lock } from '@mui/icons-material'
import * as bookmarkActions from '../state/firebaseActions/bookmark-actions'
import { useSnackbar } from 'notistack'
import RouteHeader from '../components/viewLayouts/RouteHeader'
import BookmarkCreateDialog from './BookmarkCreateDialog'
import WithLoggedInUser from '../components/HOC/auth/WithLoggedInUser'
import DirectoryCreateDialog from './Directory/DirectoryCreateDialog'
import Directory from './Directory'
import WithRouterHooks  from '../components/HOC/WithRouterHooks'
import WithDirectoryParentUUID from '../components/HOC/WithDirectoryParentUUID'
import { cacheDirectory } from '../state/appState/appActions'
import BookmarkCard from './BookmarkCard'

const BookmarksContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, 320px);
	grid-gap: 16px;
	justify-content: center;
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
	const [selectMode, setSelectMode] = useState(false)
	const [selectedBookmarkUUIDs, setSelectedBookmarkUUIDs] = useState([])
	const [processing, setProcessing] = useState(false)
	const { enqueueSnackbar } = useSnackbar();
	const { puuid } = queryParams

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

		// only render last n links
		const maxNumberOfLinks = 7
		const linksToRender = paramList.slice(Math.max(paramList.length - maxNumberOfLinks, 0))
		
		return (
			<>
				<PathLink onClick={ () => navigateToPath('') }> 
					<UnderlineText>{displayName || email}</UnderlineText> /
				</PathLink>
				{
					paramList.length > maxNumberOfLinks && '.../'
				}
				{
					linksToRender && linksToRender.map((uuid)=>(
						<PathLink key={uuid} onClick={ () => navigateToPath(uuid) }>
							<UnderlineText> {getDirectoryName(uuid)}</UnderlineText> /
						</PathLink>
					)) 
				}
			</>
		)
	}

	if(puuid && !currentDirectory){
		return (
			<>
				<RouteHeader header={"Bookmarks"} subheader={renderSubheader()} />
				<div style={{
					display: 'grid',
					placeItems: 'center',
					height: 'calc(100vh - 100px)',
				}}>
					<div style={{ display: 'grid', placeItems: 'center' }}>
						<Lock style={{ fontSize: 80, marginBottom: 16 }}/>
						<div>You do not have permission to view this directory</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<div>
			<RouteHeader header={"Bookmarks"} subheader={renderSubheader()} />
			{
				renderSelectModePanel()
			}
			<Directory currentDirectory={currentDirectory} />
			<BookmarksContainer>
				{bookmarks 
					? bookmarks.map((bookmark)=>(
						<BookmarkCard 
							bookmark={bookmark} 
							selectedBookmarkUUIDs={selectedBookmarkUUIDs}
							_setSelectedBookmarkUUIDs={setSelectedBookmarkUUIDs} 
							selectMode={selectMode} 
						/>
					)) 
					: <div>No Bookmarks found</div> }
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
		</div>
	)
}

const mapState = ({
	firestoreReducer: { ordered: { bookmarks, currentDirectory } },
	app: { directoriesCached },
}) => ({
	bookmarks,
	directoriesCached,
	currentDirectory: currentDirectory && currentDirectory[0]
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
	firestoreConnect(({ loggedInUser, queryParams }) => {
		const { puuid } = queryParams
		return (
			[
				{
					collection: 'directory',
					where: [
						['authorUID', '==', loggedInUser?.uid || ''],
						puuid ? ['uuid', '==' , puuid] : ['uuid', '==' , null],
					].filter(t=>t),
					storeAs: 'currentDirectory',
				},
			]
		)
	}),
	connect(mapState, mapDispatchToProps)
)(Bookmark)