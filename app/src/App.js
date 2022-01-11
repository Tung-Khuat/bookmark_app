import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import AuthProvider from './Auth/AuthContext'
import routes from './routes'
import PrivateRoute from './PrivateRoute'

function App(props) {
	//Remove react does not recognize prop warnings
	const backup = console.error;
	console.error = function filterWarnings(msg) {
		const supressedWarnings = ['Warning: React does not recognize'];

		if (!supressedWarnings.some(entry => msg.includes(entry))) {
			backup.apply(console, arguments);
		}
	}

	// Routing
	const createRouteElement = (route) => {
		const routeProps = {
			key: route.path,
			exact: route.exact,
			path: route.path,
			component: route.component,
		}
		if(!route.public)
			return <PrivateRoute {...routeProps} />
		
		return <Route {...routeProps} />
	}
	const routeElements = routes.map(createRouteElement)

	return (
		<AuthProvider>
			<Router>
				<Switch>
					{routeElements}
				</Switch>
			</Router>
		</AuthProvider>
	)
}

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	connect(null, mapDispatchToProps)
)(App)