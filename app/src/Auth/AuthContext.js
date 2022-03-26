import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../state/store'

const AuthContext = React.createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export default function AuthProvider(props) {
	const { children } = props
	const [currentUser, setCurrentUser] = useState(null)

	const signup = (email, password) => {
		return auth.createUserWithEmailAndPassword(email, password)
	}

	const login = (email, password) => {
		return auth.signInWithEmailAndPassword(email, password)
	}
	
	const logout = () => {
		return auth.signOut()
	}

	const resetPassword = (email) => {
		return auth.sendPasswordResetEmail(email)
	}

	useEffect(()=>{
		const authState = auth.onAuthStateChanged( user => {
			setCurrentUser(user)
		})
		return authState
	},[])


	const value = {
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
	}

	return (
		<AuthContext.Provider {...props} value={value} >
			{children}
		</AuthContext.Provider>
	)
}