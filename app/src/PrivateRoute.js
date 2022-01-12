import React from 'react'
import { compose } from 'redux'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

function PrivateRoute (props) {
	const { component: Component, persistedLoginUser, ...rest } = props
	return (
		<Route 
			{...rest}
			render={props => {
				return persistedLoginUser ? <Component {...props} /> : <Redirect to='/login' />
			}}
		/>
	)
}

const mapState = ({
	auth: { persistedLoginUser }
}) => ({ 
	persistedLoginUser
})


export default compose(
	connect(mapState)
)(PrivateRoute)