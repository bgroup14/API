import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from '../actions/types';
const initialState = {

    userId: null,
    isLogged: false,

};

// this state name is auth we define it in the combine reducer.
function authReducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {

                userId: payload.id,
                isLogged: true,


            }
        case LOGOUT:
            return {
                ...state,
                isLogged: false
            }


        default:
            return state;
    }
}
export default authReducer;