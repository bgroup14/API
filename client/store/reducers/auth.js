import { LOGIN_SUCCESS, } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    user: 'avii'
};

// this state name is counter! we define it in the combine reducer.
function authReducer(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                // ...state,
                // // isAuthenticated: true,
                // // loading: false,
                user: payload
            }


        default:
            return state;
    }
}
export default authReducer;