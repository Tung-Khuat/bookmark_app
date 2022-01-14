import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { save, load } from "redux-localstorage-simple"
import thunk from 'redux-thunk'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/functions'
import 'firebase/compat/auth'
import { getStorage } from "firebase/storage";
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'


import appReducer from './appState/appReducer'
import authReducer from './appState/authState/auth-app-reducer'

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDPgkhvqJkSkCHjcCUyUUju8bT2AdpSCks",
	authDomain: "bookmark2021-9b9cd.firebaseapp.com",
	projectId: "bookmark2021-9b9cd",
	storageBucket: "bookmark2021-9b9cd.appspot.com",
	messagingSenderId: "911713041894",
	appId: "1:911713041894:web:2c9e4a350d414549e32a27"
}

// Initialize firebase instance
export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const storage = getStorage(firebaseApp)
export const auth = firebaseApp.auth()

if (process.env.REACT_APP_FIREBASE_EMULATORS === 'enabled') {
	firebaseApp.functions('europe-west2').useEmulator('localhost', 5001)
	// firebaseApp.firestore().useEmulator('localhost', 8080)
	firebase.firestore() 
} else {
	firebase.functions() 
}

export const history = createBrowserHistory()
// Build the middleware for intercepting and dispatching navigation actions
const routerMiddleman = routerMiddleware(history)

const reducers =  combineReducers({
	router: connectRouter(history),
	app: appReducer,
	auth: authReducer,
	firebaseReducer,
	firestoreReducer,
})

const persistedReducers = ['app', 'auth']
const persistedNamespace = 'app'

const store = createStore(
    reducers, 
    load({
        states: persistedReducers,
        namespace: persistedNamespace,
        disableWarnings: true,
    }),
    compose(
		applyMiddleware(thunk),
		applyMiddleware(routerMiddleman),
        applyMiddleware(
			save({
				states: persistedReducers,
				namespace: persistedNamespace,
				debounce: 500,
			})
		),
    ),
)

export default store