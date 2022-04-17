import { defaultThemes } from "../../themes/defaultThemes"

const maxDirectoryCache = 7

export const initialState = {
    theme: defaultThemes[0],
    darkMode: true,
    directoriesCached: [],
    directoryPathCached: ''
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_APP_THEME':
            return { ...state, theme: action.theme }

        case 'TOGGLE_DARK_MODE':
            return { ...state, darkMode: !state.darkMode }

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