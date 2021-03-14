import { USER_LOGGED } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    userName: null,
    userId: null,
    userType: null,
    participantGender: null,
    participantAge: null,




};

// this state name is counter! we define it in the combine reducer.
function userReducer(state = initialState, action) {
    //console.log("in the auth reducer")
    const { type, payload } = action
    // console.log("the payload in the auth reducer is:")
    // console.log(payload)
    switch (type) {
        case USER_LOGGED:
            return {
                // ...state,
                // // isAuthenticated: true,
                // // loading: false,
                userName: payload.name,
                userId: payload.id,
                // isLogged: true,
                ///change below to payload.userType
                userType: payload.helpType,
                participantGender: payload.participantGender,
                participantAge: payload.participantAge


            }
        default:
            return state;
    }
}
export default userReducer;