import 'firebase/functions';
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from '../store'

const functions = firebaseApp.functions('europe-west2')

export const _createUser = (user) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const createUser = functions.httpsCallable(
				'createUser',
			)
			const {
				displayName,
				email,
				photoURL,
				emailVerified,
				uid,
			} = user
			
			const result = await createUser({
				displayName,
				email,
				photoURL,
				emailVerified,
				uid,
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _logout = () => {
	const auth = getAuth()

	try {
		signOut(auth)
		return({
			type: 'LOGOUT',
		})
	} catch (error) {
		console.log(error)
	}
}

