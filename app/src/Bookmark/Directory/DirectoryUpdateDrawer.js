import React, { useState, useEffect } from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button, CircularProgress, Drawer } from '@mui/material'
import { Close, Delete, DriveFileMove } from '@mui/icons-material'
import * as directoryActions from '../../state/firebaseActions/directory-actions'
import { useSnackbar } from 'notistack'
import StandardInputField from '../../components/inputs/StandardInputField'

const DRAWER_WIDTH = '40vw'

const DrawerContent = styled.div`
	width: ${DRAWER_WIDTH};
	height: 100%;
	padding: 16px;
	display: grid;
	grid-template-rows: auto 1fr auto;
`
const DrawerToolbar = styled.div`
	width: 100%;
	display: flex;
	place-items: center;
	margin-bottom: 16px;
`
const DrawerActions = styled.div`
	width: 100%;
	display: grid;
	grid-template-rows: repeat(auto, auto);
	grid-gap: 8px;
`

function DirectoryUpdateDrawer ({open, directory, _setOpen, _update, _delete}) {
	const [updatedDirectory, setUpdatedDirectory] = useState(null)
	const [processing, setProcessing] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	useEffect(()=>{
		if(directory && !updatedDirectory) {
			setUpdatedDirectory(directory)
		}
	},[directory])

	if(!directory || !updatedDirectory){
		return null
	}

	const updateInputValue = (value) => {
		setUpdatedDirectory({...updatedDirectory, ...value})
	}
	
	const handleUpdate = async () => {
		if(processing)
			return 

		setProcessing(true)

		const response = await _update(updatedDirectory, directory.uuid)

		if (response) {
			enqueueSnackbar('Update Successful', {variant: 'success'})
			_setOpen(false)
		} else {
			enqueueSnackbar('An error occurred. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	const handleDelete = async () => {
		if(processing)
			return 

		setProcessing(true)

		const response = await _delete(directory.uuid)

		if (response) {
			enqueueSnackbar('Delete Successful', {variant: 'success'})
			_setOpen(false)
		} else {
			enqueueSnackbar('An error occurred. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	return(
		<Drawer
			anchor={'right'}
			open={open}
			onClose={()=> _setOpen(false)}
		>
			<DrawerContent>
				<DrawerToolbar>
					<div style={{padding: 16, cursor: 'pointer'}} onClick={()=>_setOpen(false)} >
						<Close />
					</div>
					<h3>{`Editing: ${directory.name}`}</h3>
				</DrawerToolbar>
				<div>
					<StandardInputField
						label="Name" 
						value={updatedDirectory.name} 
						onChange={(event) => updateInputValue({name: event.target.value})} />
					<StandardInputField
						label="Description" 
						rows={3} 
						inputMaxLength={1500}
						multiline
						value={updatedDirectory.description} 
						onChange={(event) => updateInputValue({description: event.target.value})} />
				</div>
				<DrawerActions>
					<Button disabled onClick={()=>console.log('coming soon')}>
						<DriveFileMove style={{marginRight: 8}}/> Move
					</Button>
					<Button disabled={processing} color="error" onClick={handleDelete}>
						{processing 
							? <CircularProgress size={20} /> 
							: (<><Delete style={{marginRight: 8}}/> Delete</>)}
					</Button>
					<Button disabled={processing} variant="contained" onClick={handleUpdate}>
						{processing 
							? <CircularProgress size={20} /> 
							: 'Update'}
					</Button>
				</DrawerActions>
			</DrawerContent>
		</Drawer>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_update: bindActionCreators(directoryActions._update, dispatch),
	_delete: bindActionCreators(directoryActions._delete, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps)
)(DirectoryUpdateDrawer)