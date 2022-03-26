import React from 'react'
import { compose } from 'redux'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

function PrivateRoute (props) {
	const { element, persistedLoginUser } = props
	return persistedLoginUser ? element : <Navigate to='/login' />
}

const mapState = ({
	auth: { persistedLoginUser }
}) => ({ 
	persistedLoginUser
})


export default compose(
	connect(mapState)
)(PrivateRoute)