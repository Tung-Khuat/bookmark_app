import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import store from './state/store'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore'
import firebase from 'firebase/compat/app'
import { SnackbarProvider } from 'notistack';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from './components/StyledComponents/GlobalStyles'

const rrfProps = {
	firebase,
	config: {
		useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
		attachAuthIsReady: true, // attaches auth is ready promise to store
		firebaseStateName: 'firebase', // should match the reducer name ('firebase' is default)
		preserveOnDelete: null,
	},
	dispatch: store.dispatch,
	createFirestoreInstance,
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ReactReduxFirebaseProvider {...rrfProps}>
				<StyledEngineProvider injectFirst>					
					<SnackbarProvider maxSnack={3}>
						<GlobalStyles />
						<App />
					</SnackbarProvider>
				</StyledEngineProvider>
			</ReactReduxFirebaseProvider>
		</Provider>
	</React.StrictMode>,
  document.getElementById('root')
);
