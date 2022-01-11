const initialState = {
    loggedInUser: null
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'PERSIST_LOGGED_IN_USER':
            return { ...state, loggedInUser: action.user}

        case 'LOGOUT':
            return { ...state, loggedInUser: initialState.loggedInUser}
            
        default:
            return state;
    }
}