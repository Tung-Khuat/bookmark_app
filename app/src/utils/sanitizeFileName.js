const sanitizeFileName = (fileName) => {
	// Reference for name requirements:
	// https://cloud.google.com/storage/docs/naming-objects

	let newFileName = ''
	fileName
		.normalize('NFC')
		.split('')
		.forEach((letter) => {
			if (
				letter.charCodeAt() >= 32 &&
				letter.charCodeAt() <= 255 &&
				letter.charCodeAt() !== 35 && // #
				letter.charCodeAt() !== 42 && // *
				letter.charCodeAt() !== 63 && // ?
				letter.charCodeAt() !== 91 && // [
				letter.charCodeAt() !== 93 // ]
			) {
				newFileName += letter
			}
		})
		
	if (
		newFileName === '' ||
		newFileName === '.' ||
		newFileName === '..' ||
		newFileName.startsWith('.well-known/acme-challenge/')
	) {
		return `${new Date().toISOString()}-placeholder-name`
	}

	return newFileName
}

export const renameFileWithSanitizedName = (file) => {
	return new File([file], sanitizeFileName(file.name), {
		type: file.type,
		lastModified: file.lastModified,
	})
}

export default sanitizeFileName
