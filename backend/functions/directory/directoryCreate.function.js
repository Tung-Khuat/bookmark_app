const functions = require('firebase-functions')
const uuid = require('uuid')
const admin = require('firebase-admin')
const db = admin.firestore()

const handleFunc = async (data, context) => {
	const {
		name,
		description,
		parentUUID,
	} = data

	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 
			'The function must be called while authenticated.')
	}

	const authorData = context ? {
		uid: context.auth.uid,
		name: context.auth.token.name || null,
		email: context.auth.token.email || null,
	} : null

	const dataUUID = uuid.v4()
	const ts = Date.parse(new Date())

	await db.collection('directory').doc(dataUUID).set({
		uuid: dataUUID,
		collection: 'directory',
		name: name || 'Untitled',
		description,		
		createdAt: ts,
		authorData,
		authorUID: context.auth.uid,
		parentUUID,
	})

	const directory = await db.collection('directory').doc(dataUUID).get()
	if (!directory.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid.',
		)
	}
	const directoryData = directory.data()

	return directoryData

}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
