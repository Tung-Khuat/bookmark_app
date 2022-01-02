const functions = require('firebase-functions')
const admin = require("firebase-admin");
const serviceAccount = require("./bookmark2021-9b9cd-firebase-adminsdk-li5nk-f04a7a73a1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const glob = require('glob')
const files = glob.sync('./**/*.function.js', {
	cwd: __dirname,
	ignore: './node_modules/**',
})

for (let i = 0; i < files.length; i++) {
	const file = files[i]
	const functionName = file.split('/').pop().slice(0, -12) // Strip off '.function.js'
	if (
		!process.env.FUNCTION_NAME ||
		process.env.FUNCTION_NAME === functionName
	) {
		exports[functionName] = require(file)
	}
}