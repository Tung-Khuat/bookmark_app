import React, { Suspense } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'
import { history } from './state/store'
import routes from './routes'
import FullViewLoading from './components/loadingIndicators/FullViewLoading'
import UserProfileFAB from './components/viewLayouts/UserProfileFAB'
import WithLoggedInUser from './components/HOC/auth/WithLoggedInUser'
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
			element: route.component,
		}

		if(!route.public){
			return <Route {...routeProps} element={<PrivateRoute element={route.component} />}/>
		}
		
		return <Route {...routeProps} />
	}
	const routeElements = routes.map(createRouteElement)

	const renderRoute = () => {
		console.log(props.loggedInUser)
		return (
			<>
				{
					props.loggedInUser && (
						<UserProfileFAB />
					)
				}
				<Routes>
					{routeElements}
				</Routes>
			</>
		)
	}

	return (
		<Suspense fallback={<FullViewLoading />}>
			<ConnectedRouter history={history}>
				<Router>
						{renderRoute()}
				</Router>
			</ConnectedRouter>
		</Suspense>
	)
}

const mapState = ({
	auth: { persistedLoginUser }
}) => ({ 
	persistedLoginUser
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	WithLoggedInUser,
	connect(mapState, mapDispatchToProps)
)(App)