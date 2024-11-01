import React, { Suspense, useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import routes from './routes'
import FullViewLoading from './components/loadingIndicators/FullViewLoading'
import UserProfileFAB from './components/viewLayouts/UserProfileFAB'
import WithLoggedInUser from './components/HOC/auth/WithLoggedInUser'
import PrivateRoute from './PrivateRoute'
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './components/styledComponents/GlobalStyles'
import { reverseContrastColors } from './themes/themeUtils'

function App(props) {
	const [theme, setTheme] = useState(null)

	useEffect(()=>{
		const { storedTheme, darkMode } = props
		if(storedTheme || darkMode){
			let updatedThemeColors = { ...storedTheme.themeColors }
			if(darkMode) {
				updatedThemeColors = reverseContrastColors(updatedThemeColors)
			}
			const { primaryContrastA, primaryContrastB, highlight, primary, secondary, destructive } = updatedThemeColors
			const updatedTheme = {
				...storedTheme,
				fixedColors: storedTheme.themeColors, 
				themeColors: updatedThemeColors,
				fontColor: primaryContrastA,
				backgroundColor: primaryContrastB,
				linkColor: highlight,
				primary:  primary || highlight,
				destructive:  destructive || "#d32f2f",
				secondary:  secondary || "#2886e3",
			}
			setTheme(updatedTheme)
		}
	},[props.darkMode, props.storedTheme])

	//Remove react does not recognize prop warnings
	const backup = console.error;
	console.error = function filterWarnings(msg) {
		const suppressedWarnings = ['Warning: React does not recognize', 'Warning: Using UNSAFE_componentWillReceiveProps'];

		if (!suppressedWarnings.some(entry => msg.includes(entry))) {
			backup.apply(console, arguments);
		}
	}

	// Routing
	const createRoute = (route) => {
		const routeProps = {
			key: route.path,
			exact: route.exact,
			path: route.path,
			element: route.component,
		}

		return <Route {...routeProps} />
	}
	const createPrivateRoutes = (routes) => {
		return (
			<Route element={<PrivateRoute />}>
				{routes.map(createRoute)}
          	</Route>
		)

	}
	const publicRoutes = routes.filter((route)=> route.public)
	const privateRoutes = routes.filter((route)=> !route.public)

	const renderRoute = () => {
		return (
			<>
				{
					props.loggedInUser && (
						<UserProfileFAB />
					)
				}
				<Routes>
					{publicRoutes.map(createRoute)}
					{createPrivateRoutes(privateRoutes)}
				</Routes>
			</>
		)
	}

	if(!theme){
		return null
	}

	return (
		<Suspense fallback={<FullViewLoading />}>
			<ThemeProvider theme={theme}>
				<GlobalStyles theme={theme} />
					<Router>
						{renderRoute()}
					</Router>
			</ThemeProvider>
		</Suspense>
	)
}

const mapState = ({
	auth: { persistedLoginUser }, app: { theme, darkMode },
}) => ({ 
	persistedLoginUser,
	storedTheme: theme,
	darkMode,
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(
	WithLoggedInUser,
	connect(mapState, mapDispatchToProps)
)(App)