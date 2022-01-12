import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Route, Redirect } from 'react-router-dom'

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

const mapState = ({
	auth: { loggedInUser }
}) => ({
	loggedInUser
})

export default compose(
	connect(mapState),
)(PrivateRoute)