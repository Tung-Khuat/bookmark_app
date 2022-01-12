const initialState = {
    placeholder: null
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'PLACEHOLDER':
            return null

        default:
            return state;
    }
}