import 'firebase/app';
import 'firebase/functions';
import { firebaseApp } from '../store'

const functions = firebaseApp.functions('europe-west2')

export const _createBookmark = ({ title, description, link, thumbnail, uploads, tags, folder }) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const messageChannelCreate = functions.httpsCallable(
				'bookmarkCreate',
			)
			const result = await messageChannelCreate({
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