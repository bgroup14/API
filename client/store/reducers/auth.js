import { LOGIN_SUCCESS, } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    userName: null,
    userId: null,
    isLogged: false

};

// this state name is counter! we define it in the combine reducer.
function authReducer(state = initialState, action) {
    //console.log("in the auth reducer")
    const { type, payload } = action
    // console.log("the payload in the auth reducer is:")
    // console.log(payload)
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                // ...state,
                // // isAuthenticated: true,
                // // loading: false,
                userName: payload.name,
                userId: payload.id,
                isLogged: true

            }


        default:
            return state;
    }
}
export default authReducer;