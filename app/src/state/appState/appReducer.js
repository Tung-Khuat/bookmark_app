const initialState = {
    directoriesCached: [],
    directoryPathCached: ''
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'CACHE_DIRECTORY':
            return { ...state, directoriesCached: [...state.directoriesCached, action.directory] }

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