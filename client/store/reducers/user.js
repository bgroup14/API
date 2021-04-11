import { State } from 'react-native-gesture-handler';
import { USER_LOGGED, IMAGE_UPDATED, FEED_SETTINGS_UPDATED, RECEIVED_USER_COORDINATES } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    userName: null,
    userId: null,
    userType: null,
    participantGender: null,
    participantAge: null,
    meetingLocation: null,
    userImage: null,
    userLong: null,
    userLat: null





};

// this state name is counter! we define it in the combine reducer.
function userReducer(state = initialState, action) {
    //console.log("in the auth reducer")
    const { type, payload } = action
    // console.log(payload.meetingLocation)
    // console.log("the payload.pictureuri in the user reducer is:")
    // console.log(payload.pictureUrl)
    console.log("the payload in the user reducer issss:")
    console.log(payload)
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
                participantAge: payload.participantAge,
                meetingLocation: payload.meetingLocation,
                userImage: payload.pictureUrl,
                userLong: null,
                userLat: null

            }
        case IMAGE_UPDATED:
            return {
                ...state,
                userImage: payload

            }
        case FEED_SETTINGS_UPDATED:

            console.log("updating feed settings....!!")
            // console.log("payload usertype is: " + payload.memberType)
            // console.log(payload.memberType == "Both")
            return {
                ...state,
                userType: payload.memberType,
                participantGender: payload.participantGender,
                participantAge: payload.participantAgeRange,
                meetingLocation: payload.postLocation


            }
        case RECEIVED_USER_COORDINATES:
            console.log("received user coordinates")
            return {
                ...state,
                userLong: payload.userLong,
                userLat: payload.userLat
            }
        default:
            return state;
    }
}
export default userReducer;