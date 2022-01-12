import React from 'react'
import { compose } from 'redux'
import { Route, Redirect } from 'react-router-dom'
import WithLoggedInUser from './components/HOC/auth/WithLoggedInUser'

function PrivateRoute (props) {
	const { component: Component, loggedInUser, ...rest } = props
	
	return (
		<Route 
			{...rest}
			render={props => {
				return loggedInUser ? <Component {...props} /> : <Redirect to='/login' />
			}}
		/>
	)
}

export default compose(
	WithLoggedInUser,
)(PrivateRoute)