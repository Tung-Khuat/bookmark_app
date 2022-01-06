const functions = require('firebase-functions')
const uuid = require('uuid')
const admin = require('firebase-admin')
const db = admin.firestore()

const handleFunc = async (data, context) => {
	const {
		title,
		description,
		link,
		thumbnail,
		uploads,
		tags,
		folder,
	} = data
	// const author = context ? {
	// 	uid: context.auth.uid,
	// 	name: context.auth.token.name || null,
	// 	email: context.auth.token.email || null,
	// } : null
	const dataUUID = uuid.v4()
	const ts = Date.parse(new Date())

	await db.collection('bookmark').doc(dataUUID).set({
		uuid: dataUUID,
		collection: 'bookmark',
		title,
		description,
		link,
		tags: tags || [],
		thumbnail,
		uploads: uploads || [],
		folder,
		createdAt: ts,
	})

	const bookmark = await db.collection('bookmark').doc(dataUUID).get()
	if (!bookmark.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called with a valid uuid.',
		)
	}
	const bookmarkData = bookmark.data()

	return bookmarkData

}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
