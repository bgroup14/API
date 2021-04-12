import { NEW_MESSAGE, NO_NEW_MESSAGE, NEW_MEETING, NO_NEW_MEETING } from '../actions/types';
const initialState = {
    newMeeting: false,
    receivedMessage: false
};

// this state name is counter! we define it in the combine reducer.
function notification(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case NEW_MESSAGE:
            return {
                ...state,
                receivedMessage: true,

            }
        case NO_NEW_MESSAGE:
            return {
                ...state,
                receivedMessage: false,

            }

        case NEW_MEETING:
            return {
                ...state,
                newMeeting: true,

            }
        case NO_NEW_MEETING:
            return {
                ...state,
                newMeeting: false,

            }




        default:
            return state;
    }
}
export default notification;