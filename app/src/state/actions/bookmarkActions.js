import 'firebase/app';
import 'firebase/functions';
import { firebaseApp } from '../store'

const functions = firebaseApp.functions('europe-west2')

export const _createBookmark = ({ title, description, link, thumbnail, uploads, tags, folder }) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const createBookmark = functions.httpsCallable(
				'bookmarkCreate',
			)
			const result = await createBookmark({
				title,
				description,
				link,
				thumbnail, 
				uploads,
				tags,
				folder,
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _updateBookmark = ({ title, description, link, thumbnail, uploads, tags, folder }, uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const updateBookmark = functions.httpsCallable(
				'bookmarkUpdate',
			)
			const result = await updateBookmark({
				title,
				description,
				link,
				thumbnail, 
				uploads,
				tags,
				folder,
				uuid
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _deleteBookmark = (uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const deleteBookmark = functions.httpsCallable(
				'bookmarkDelete',
			)
			const result = await deleteBookmark({
				uuid
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}