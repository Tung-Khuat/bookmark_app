const functions = require('firebase-functions')
const uuid = require('uuid')
const admin = require('firebase-admin')
const db = admin.firestore()

const handleFunc = async (data, context) => {
	const {
		displayName,
		email,
		photoURL,
		emailVerified,
		uid,
	} = data

	if (typeof data.uid !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid user.',
		)
	}

	const ts = Date.parse(new Date())
	const userWithMatchingUID = await db.collection('user').doc(data.uid).get()
	if (userWithMatchingUID.exists) {
		return null
	}

	await db.collection('user').doc(data.uid).set({
		displayName,
		email,
		photoURL,
		emailVerified,
		uid,
		createdAt: ts,
	})

	const user = await db.collection('user').doc(data.uid).get()

	const userData = user.data()

	return userData

}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
