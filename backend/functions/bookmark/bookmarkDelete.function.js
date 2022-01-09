const functions = require('firebase-functions')
const admin = require('firebase-admin')

const db = admin.firestore()

const handleFunc = async (data, context) => {
	if (typeof data.uuid !== 'string') {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
				'with a uuid value.')
	}

	// Get the item from firestore
	const item = await db.collection('bookmark').doc(data.uuid).get()
	if (!item.exists) {
		throw new functions.https.HttpsError('failed-precondition', 'No items found with this uuid')
	}
	const itemData = item.data()

	return db.collection('bookmark').doc(itemData.uuid).delete()
}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
