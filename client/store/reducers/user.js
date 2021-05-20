import { USER_LOGGED, IMAGE_UPDATED, FEED_SETTINGS_UPDATED, RECEIVED_USER_COORDINATES } from '../actions/types';
const initialState = {
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

function userReducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case USER_LOGGED:
            return {

                userName: payload.name,
                userId: payload.id,
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


            return {
                ...state,
                userType: payload.memberType,
                participantGender: payload.participantGender,
                participantAge: payload.participantAgeRange,
                meetingLocation: payload.postLocation


            }
        case RECEIVED_USER_COORDINATES:
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