import { LOGIN_SUCCESS, REGISTER_SUCCESS } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    // userName: null,
    userId: null,
    isLogged: false,
    // userType: "Both",
    // participantGender: "Dosen't Matter",
    // participantAge: "Dosen't Matter",


};

// this state name is counter! we define it in the combine reducer.
function authReducer(state = initialState, action) {
    //console.log("in the auth reducer")
    const { type, payload } = action
    // console.log("the payload in the auth reducer is:")
    // console.log(payload)
    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                // ...state,
                // // isAuthenticated: true,
                // // loading: false,
                // userName: payload.name,
                userId: payload.id,
                isLogged: true,
                // ///change below to payload.userType
                // userType: 'Both',
                // participantGender: "Dosen't Matter",
                // participantAge: "Dosen't Matter"

            }


        default:
            return state;
    }
}
export default authReducer;