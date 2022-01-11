import 'firebase/app';
import 'firebase/functions';
import { deleteObject, getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage'
import { firebaseApp, storage } from '../store'

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

export const _updateBookmark = ({ title, description, link, thumbnail, tags, folder }, uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const updateBookmark = functions.httpsCallable(
				'bookmarkUpdate',
			)

			const bookmarkFileListRef = ref(storage, `bookmark-uploads/${uuid}`)
			const fileList = await listAll(bookmarkFileListRef)
			const uploads = []
			for(let fileRef of fileList.items) {
				const url = await getDownloadURL(fileRef)
				const fileMetaData = await getMetadata(fileRef)
				const { name, timeCreated } = fileMetaData
				uploads.push({
					url,
					name,
					createdAt: timeCreated,
				})
			}

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
			const folderRef = ref(storage, `bookmark-uploads/${uuid}`)
			const fileList = await listAll(folderRef)
			const promises = []
			for(let item of fileList.items) {
				promises.push(deleteObject(item))
			}
			try {
				await Promise.all(promises)
				console.log(`%c Successfully deleted upload`, 'color: green')

				
			} catch (error) {
				console.log('%c Failed to delete uploads.', 'color: red')
			}

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