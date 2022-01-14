import { firebaseApp } from '../store'

const functions = firebaseApp.functions('europe-west2')

export const _create = ({ name, description, parentUUID }) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const create = functions.httpsCallable(
				'directoryCreate',
			)
			const result = await create({
				name,
				description,
				parentUUID,
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _update = ({ name, description, parentUUID }, uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const update = functions.httpsCallable(
				'directoryUpdate',
			)

			const result = await update({
				name,
				description,
				parentUUID,
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _delete = (uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const deleteDirectory = functions.httpsCallable(
				'directoryDelete',
			)
			
			const result = await deleteDirectory({
				uuid
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}



	