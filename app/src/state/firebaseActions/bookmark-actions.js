import 'firebase/functions';
import { deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytesResumable } from 'firebase/storage'
import { renameFileWithSanitizedName } from '../../utils/sanitizeFileName'
import { firebaseApp, storage } from '../store'

const functions = firebaseApp.functions('europe-west2')
const bookmarkUploadBucket = 'bookmark-uploads'

const getSanitizedNameFile = (file) => {
	const sanitizedFile = renameFileWithSanitizedName(file)
	const newFileName = sanitizedFile.name.replace(/ /g,"_")
	return new File([file], newFileName);
}

export const _createBookmark = ({ title, description, link, thumbnail, uploads, tags, parentUUID }) =>
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
				parentUUID,
			})
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

export const _updateBookmark = ({ title, description, link, thumbnail, tags, parentUUID }, uuid) =>
	async function (dispatch, getState, getFirebase) {
		try {
			const updateBookmark = functions.httpsCallable(
				'bookmarkUpdate',
			)

			const bookmarkFileListRef = ref(storage, `${bookmarkUploadBucket}/${uuid}`)
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
				parentUUID,
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
			const folderRef = ref(storage, `${bookmarkUploadBucket}/${uuid}`)
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

export const _upload = ({bookmarkUUID, file}) =>
	async function (dispatch, getState, getFirebase) {
		if (!bookmarkUUID || !file) {
			return false
		}

		try {
			const storageRef = ref(storage, `bookmark-uploads/${bookmarkUUID}/${file.name}`)
			// Create the file metadata
			const metadata = {
				customMetadata: {
					bookmarkUUID,
				},
			}

			const operation = new Promise((resolve, reject) => {
				const renamedFile = getSanitizedNameFile(file)
				const uploadTask = uploadBytesResumable(storageRef, renamedFile, metadata)

				const progressFunc = (snapshot) => {
					// const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					// console.log('Upload is ' + progress + '% done')
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused')
							break
						case 'running':
							console.log('Upload is running')
							break
						default:
							break
					}
				}
				const errorHandlingFunc = (error) => {
					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {
						case 'storage/unauthorized':
							// User doesn't have permission to access the object
							console.error('storage permission denied')
							reject(error.code)
							break

						case 'storage/canceled':
							// User canceled the upload
							console.error('upload cancelled')
							reject(error.code)
							break

						case 'storage/unknown':
							// Unknown error occurred, inspect error.serverResponse
							console.error('unknown storage error')
							reject(error.code)
							break

						default:
							console.error('default storage error')
							break
					}
				}

				const completeFunc = () => {
					// Upload completed successfully
					resolve(uploadTask)
					console.log(`%c Successfully uploaded file`, 'color: green')
				}

				// Listen for state changes, errors, and completion of the upload.
				uploadTask.on(
					"state_changed",
					progressFunc,
					errorHandlingFunc,
					completeFunc,
				)
			})
			const result = await operation
			return result
		} catch (ex) {
			console.log(ex)
			if (window.sentry) window.sentry.captureException(ex)
			return false
		}
	}

	