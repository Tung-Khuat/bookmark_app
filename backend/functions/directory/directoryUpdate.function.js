const functions = require('firebase-functions')
const uuid = require('uuid')
const admin = require('firebase-admin')
const db = admin.firestore()

const handleFunc = async (data, context) => {
	const {
		name, //string
		description, //string
		uuid // string
	} = data

	if (typeof data.uuid !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid value.',
		)
	}
	if (data.name && typeof data.name !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid name value.',
		)
	}
	if (data.description && typeof data.description !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid description value.',
		)
	}
	if (data.parentUUID && typeof data.parentUUID !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid parentUUID value.',
		)
	}
	
	const directory = await db.collection('directory').doc(data.uuid).get()
	if (!directory.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid.',
		)
	}
	const directoryData = directory.data()

	const update = {
		modifiedAt: Date.parse(new Date()),
	}

	if (data.name) update.name = name
	if (typeof data.description === 'string') update.description = description
	if (data.parentUUID) update.parentUUID = data.parentUUID
	
	await db.collection('directory').doc(directoryData.uuid).update(update)

	return Promise.resolve()
}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
