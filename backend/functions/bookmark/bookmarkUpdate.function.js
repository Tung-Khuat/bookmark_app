const functions = require('firebase-functions')
const uuid = require('uuid')
const admin = require('firebase-admin')
const db = admin.firestore()

const handleFunc = async (data, context) => {
	const {
		title, //string
		description, //string
		link, //string
		thumbnail, //object
		uploads, //array of objects
		tags,// array of tag objects
		parentUUID, // string
		uuid // string
	} = data

	if (typeof data.uuid !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid value.',
		)
	}
	if (data.title && typeof data.title !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid title value.',
		)
	}
	if (data.link && typeof data.link !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid link value.',
		)
	}
	if (data.thumbnail && typeof data.thumbnail !== 'object') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid thumbnail value.',
		)
	}
	if (data.uploads && !Array.isArray(data.uploads)) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uploads value.',
		)
	}
	if (data.tags && !Array.isArray(data.tags)) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid tags value.',
		)
	}

	if (data.parentUUID && typeof data.parentUUID !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid folder value.',
		)
	}
	
	const bookmark = await db.collection('bookmark').doc(data.uuid).get()
	if (!bookmark.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid.',
		)
	}
	const bookmarkData = bookmark.data()

	const update = {
		modifiedAt: Date.parse(new Date()),
	}

	if (data.title) update.title = title
	if (typeof data.description === 'string') update.description = description
	if (data.link) update.link = link
	if (data.thumbnail) update.thumbnail = thumbnail
	if (data.uploads) {
		update.uploads = uploads
		if(!data.thumbnail && !bookmarkData.thumbnail && data.uploads.length > 0){
			update.thumbnail = data.uploads[0]
		}
	}
	if (data.tags) update.tags = tags
	if (data.parentUUID) update.parentUUID = parentUUID
	
	await db.collection('bookmark').doc(bookmarkData.uuid).update(update)

	return Promise.resolve()
}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
