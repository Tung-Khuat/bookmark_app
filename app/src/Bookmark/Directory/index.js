import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import truncate from 'truncate'
import WithDirectoryParentUUID from '../../components/HOC/WithDirectoryParentUUID'
import WithLoggedInUser from '../../components/HOC/auth/WithLoggedInUser'
import { ArrowBackIos, ExpandMore, Folder, MoreVert } from '@mui/icons-material'
import { firestoreConnect } from 'react-redux-firebase'
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tooltip } from '@mui/material'
import { withStyles } from "@material-ui/core/styles";
import { Subtext } from '../../components/styledComponents/BasicComponents'
import DirectoryUpdateDrawer from './DirectoryUpdateDrawer'
import * as appActions from '../../state/appState/appActions'

const StyledAccordion = withStyles({
	root: {
		"&$expanded": {
			margin: "0 auto"
		},
		zIndex: 9,
		width: "calc(100% - 64px)",
		margin: "0 auto",
	},
	expanded: {},
  })(Accordion);

const ListContainer = styled.div`
	width: calc(100% - 64px);
	margin: 16px 0;
	padding: 0 32px;
	display: flex;
	flex-direction: column;
	place-items: center;
	div:last-child {
		border-bottom: none;
	}
`
const DirectoryItem = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-gap: 8px;
	place-items: center;
	cursor: pointer;
	border-bottom: 1px solid #cbcbcb;
`
const BackNavContainer = styled.div`
	width: 100%;
	display: grid;
	grid-gap: 16px;
	place-items: center;
	justify-content: start;
	grid-template-columns: auto 1fr;
	padding: 0 16px;
`
const AccordionSummaryTitle = styled.div`
	width: 100%;
	font-size: 1.2em;
	font-weight: 400;
	margin-left: 16px;
`

function Directory (props) {
	const [openEditDrawer, setOpenEditDrawer] = useState(true)
	const [directoryInEdit, setDirectoryInEdit] = useState(null)
	const [accordionExpanded, setAccordionExpanded] = useState(false)
	const { directories, currentDirectory, router, app, _cacheDirectory, _clearCacheDirectory } = props

	useEffect(()=>{
		if(currentDirectory){
			const { directoriesCached } = app
			const currentPath = router.location.pathname
			const cached =  directoriesCached?.length !== 0 
				&& directoriesCached.find((d) => d?.uuid === currentDirectory.uuid)
			if(!cached){
				_cacheDirectory(currentDirectory)
			}
			if(currentPath === "/" || currentPath === "/bookmark"){
				if(directoriesCached?.length > 20)
					_clearCacheDirectory(currentDirectory)
			}
		}
	},[currentDirectory, router.location])

	const navigateToDirectory = (directoryUUID) => {
		const currentPath = router.location?.pathname !== '/' ? router.location.pathname : '/bookmark'
		const directoryPath = `${currentPath}/${directoryUUID}`
		router.navigate(directoryPath)
	}

	useEffect(()=>{
		if(directories && directories.length < 1){
			setAccordionExpanded(false)
		}
	},[directories])

	const renderDirectory = (directory) => {
		return (
			<DirectoryItem 
				key={directory.uuid} 
				onClick={()=>navigateToDirectory(directory.uuid)}
			>
				<Folder style={{ fontSize: 32 }} />
				<div style={{width: '100%'}}>
					<Tooltip title={directory.name || 'Untitled'} enterDelay={2000}>
							<span>{truncate(directory.name, 50) || 'Untitled'}</span>
					</Tooltip>
				</div>
				<IconButton
					onClick={(e)=>{
						e.preventDefault()
						e.stopPropagation()
						setOpenEditDrawer(true)
						setDirectoryInEdit(directory)
					}}
				>
					<MoreVert/>
				</IconButton>
			</DirectoryItem>
		)
	}

	const handleBackPush = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const currentPath = router.location.pathname
		const previousPath = currentPath.substr(0, currentPath.lastIndexOf("/"));
		router.navigate(`${previousPath}`)
	}

	return (
		<div style={{display: 'block', height: 80}}>
			<StyledAccordion 
				expanded={accordionExpanded}
				onChange={()=>setAccordionExpanded(!accordionExpanded)}	
			>
				<AccordionSummary
					expandIcon={<ExpandMore />}
				>
					{currentDirectory ? (
							<BackNavContainer>
								<ArrowBackIos 
									style={{cursor: 'pointer', fontSize: '0.9em', padding: 4}} 
									onClick={handleBackPush} />
								<AccordionSummaryTitle>{currentDirectory.name}</AccordionSummaryTitle>
							</BackNavContainer>
						) : <AccordionSummaryTitle>Directories</AccordionSummaryTitle>
					}
				</AccordionSummary>
				<AccordionDetails>
					<ListContainer>
						{directories && directories.length > 0 ? directories.map(renderDirectory) : <Subtext>No folders found under this directory.</Subtext>}
					</ListContainer>
				</AccordionDetails>
			</StyledAccordion>
			<DirectoryUpdateDrawer open={openEditDrawer} _setOpen={setOpenEditDrawer} directory={directoryInEdit}/>
		</div>
	)
}

const mapState = ({
	firestoreReducer: { ordered: { directories, currentDirectory } },
	app,
}) => ({
	directories, 
	app,
	currentDirectory: currentDirectory && currentDirectory[0]
})

const mapDispatchToProps = (dispatch) => ({
	_cacheDirectory: bindActionCreators(appActions.cacheDirectory, dispatch),
	_clearCacheDirectory: bindActionCreators(appActions.clearCacheDirectory, dispatch),
})

export default compose(
	WithLoggedInUser,
	WithDirectoryParentUUID,
	firestoreConnect(({ loggedInUser, directoryUUID }) => {
		return (
			[
				{
					collection: 'directory',
					where: [
						['authorUID', '==', loggedInUser?.uid || ''],
						directoryUUID ? ['parentUUID', '==' , directoryUUID] : ['parentUUID', '==' , null],
					].filter(t=>t),
					storeAs: 'directories',
				},
			]
		)
	}),
	firestoreConnect(({ directoryUUID }) => {
		return (
			[
				{
					collection: 'directory',
					where: [
						directoryUUID ? ['uuid', '==' , directoryUUID] : ['uuid', '==' , null],
					].filter(t=>t),
					storeAs: 'currentDirectory',
				},
			]
		)
	}),
	connect(mapState, mapDispatchToProps)
)(Directory)