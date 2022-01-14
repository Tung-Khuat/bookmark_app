import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { bindActionCreators, compose } from 'redux'
import { useAuth } from '../auth/AuthContext'
import StandardDialog from '../components/dialogs/StandardDialog'
import { StyledAnchor } from '../components/styledComponents/BasicComponents'
import * as authActions from '../state/firebaseActions/auth-actions'


function UserPersonalizedSettingsDialog (props) {
	const { open, _setOpen, _logout, _push } = props
	const { logout } = useAuth()
	const { enqueueSnackbar }= useSnackbar()

	const handleLogout = async () => {
		try {
			await logout()
			_logout()
			_push('./login')
		} catch (error) {
			enqueueSnackbar('Failed to logout. Please try again.', { variant: 'error' })
		}
	}

	return (
		<StandardDialog
			dialogSize={"small"}
			open={open}
			_setOpen={_setOpen}
		>
			<StyledAnchor onClick={handleLogout}>Logout</StyledAnchor>
		</StandardDialog>
	)
}

const mapDispatchToProps = (dispatch) => ({
	_logout: bindActionCreators(authActions._logout, dispatch),
	_push: bindActionCreators(push, dispatch),
})

export default compose(
	connect(null, mapDispatchToProps),
)(UserPersonalizedSettingsDialog)