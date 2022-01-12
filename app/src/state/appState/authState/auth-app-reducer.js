const initialState = {
    persistedLoginUser: null
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'PERSIST_LOGGED_IN_USER':
            return { ...state, persistedLoginUser: action.user}

        case 'LOGOUT':
            return { ...state, persistedLoginUser: initialState.persistedLoginUser}
            
        default:
            return state;
    }
}