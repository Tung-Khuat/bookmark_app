import React, { Suspense } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'
import { history } from './state/store'
import routes from './routes'
import PrivateRoute from './PrivateRoute'
import FullViewLoading from './components/loadingIndicators/FullViewLoading'
import UserProfileFAB from './components/viewLayouts/UserProfileFAB'
import WithLoggedInUser from './components/HOC/auth/WithLoggedInUser'

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

	const renderRoute = () => {
		return (
			<>
				{
					props.loggedInUser && (
						<UserProfileFAB />
					)
				}
				{routeElements}
			</>
		)
	}

	return (
		<Suspense fallback={<FullViewLoading />}>
			<ConnectedRouter history={history}>
				<Router>
					<Switch>
						{renderRoute()}
					</Switch>
				</Router>
			</ConnectedRouter>
		</Suspense>
	)
}

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	WithLoggedInUser,
	connect(null, mapDispatchToProps)
)(App)