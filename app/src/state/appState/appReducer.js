const maxDirectoryCache = 7

const initialState = {
    directoriesCached: [],
    directoryPathCached: ''
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'CACHE_DIRECTORY':
            const updated = [...state.directoriesCached, action.directory]
        
            return { ...state, directoriesCached: updated.slice(Math.max( updated.length - maxDirectoryCache, 0)) }

        case 'CLEAR_CACHE_DIRECTORY':
            return { ...state, directoriesCached: initialState.directoriesCached }

        case 'CACHE_DIRECTORY_PATH':
            return { ...state, directoryPathCached: action.directoryPath }

        case 'CLEAR_CACHE_DIRECTORY_PATH':
            return { ...state, directoryPathCached: initialState.directoryPathCached }

        default:
            return state;
    }
}