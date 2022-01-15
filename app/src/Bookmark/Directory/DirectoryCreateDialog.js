import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CircularProgress, TextField } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as directoryActions from '../../state/firebaseActions/directory-actions'
import { useSnackbar } from 'notistack'
import WithQueryParams from '../../components/HOC/WithQueryParams'

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`

const initialDirectoryState =  {
	name: "",
	description: "",
}

function DirectoryCreateDialog (props) {
	const { visible, queryParams, _setVisible, _create } = props
	const [directory, setDirectory ] = useState(initialDirectoryState)
	const [processing, setProcessing ] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const updateInputValue = (value) => {
		setDirectory({...directory, ...value})
	}

	const onDirectoryCreate = async () => {
		if(processing)
			return 

		setProcessing(true)

		const { puuid } = queryParams
		const newDirectory = { ...directory, parentUUID: puuid || null }
		const response = await _create(newDirectory)

		if (response) {
			enqueueSnackbar('Successfully created a directory', {variant: 'success'})
			setDirectory(initialDirectoryState)
		} else {
			enqueueSnackbar('An error occurred. Please try again later.', {variant: 'error'})
		}

		setProcessing(false)
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Directory create"}
			dialogActions={[
				<Button onClick={onDirectoryCreate}>{processing ? <CircularProgress size={20} /> : 'Create'}</Button>
			]}
		>
			<StyledInputField
				label="Name" 
				variant="outlined" 
				value={directory.name} 
				onChange={(event) => updateInputValue({name: event.target.value})} />
			<StyledInputField 
				label="Description" 
				variant="outlined" 
				value={directory.description}
				rows={3} 
				multiline
				onChange={(event) => updateInputValue({description: event.target.value})} />
		</StandardDialog>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_create: bindActionCreators(directoryActions._create, dispatch),
})

export default compose(
	WithQueryParams,
	connect(null, mapDispatchToProps)
)(DirectoryCreateDialog)