import React, { useState } from 'react'
import { CircularProgress } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as directoryActions from '../../state/firebaseActions/directory-actions'
import { useSnackbar } from 'notistack'
import WithDirectoryParentUUID from '../../components/HOC/WithDirectoryParentUUID'
import StandardInputField from '../../components/inputs/StandardInputField'
import { ThemeButton } from '../../components/styledComponents/Buttons'

const initialDirectoryState =  {
	name: "",
	description: "",
}

function DirectoryCreateDialog (props) {
	const { visible, directoryUUID, _setVisible, _create } = props
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

		const newDirectory = { ...directory, parentUUID: directoryUUID || null }
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
				<ThemeButton variant="raised" onClick={onDirectoryCreate}>{processing ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Create'}</ThemeButton>
			]}
		>
			<StandardInputField
				label="Name" 
				value={directory.name} 
				onChange={(event) => updateInputValue({name: event.target.value})} />
			<StandardInputField 
				label="Description" 
				value={directory.description}
				multiline
				rows={3}
				inputMaxLength={1500} 
				onChange={(event) => updateInputValue({description: event.target.value})} />
		</StandardDialog>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_create: bindActionCreators(directoryActions._create, dispatch),
})

export default compose(
	WithDirectoryParentUUID,
	connect(null, mapDispatchToProps)
)(DirectoryCreateDialog)