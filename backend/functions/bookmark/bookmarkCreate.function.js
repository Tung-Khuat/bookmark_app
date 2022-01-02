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

	return db.collection('bookmark').doc(dataUUID).set({
		uuid: dataUUID,
		collection: 'bookmark',
		title,
		description,
		link,
		tags: tags || [],
		thumbnail,
		uploads: uploads || [],
		folder,
		ts,
	})
}

module.exports = functions.region('europe-west2').https.onCall(handleFunc)
