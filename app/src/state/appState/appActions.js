export const cacheDirectory = (directory) => ({
	type: 'CACHE_DIRECTORY',
	directory,
})

export const clearCacheDirectory = () => ({
	type: 'CLEAR_CACHE_DIRECTORY',
})

export const cacheDirectoryPath = (directoryPath) => ({
	type: 'CACHE_DIRECTORY_PATH',
	directoryPath,
})

export const clearCacheDirectoryPath = () => ({
	type: 'CLEAR_CACHE_DIRECTORY_PATH',
})

export const setAppTheme = (theme) => ({
	type: 'SET_APP_THEME',
	theme,
})

export const toggleDarkMode = () => ({
	type: 'TOGGLE_DARK_MODE',
})


