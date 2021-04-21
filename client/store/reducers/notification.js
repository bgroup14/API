import { NEW_MESSAGE, NO_NEW_MESSAGE, NEW_NOTIFICATION, NO_NEW_NOTIFICATION } from '../actions/types';
const initialState = {
    newNotification: false,
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

        case NEW_NOTIFICATION:
            console.log("in the notification reducer with new notifiation dispeched")
            return {
                ...state,
                newNotification: true,

            }
        case NO_NEW_NOTIFICATION:
            return {
                ...state,
                newNotification: false,

            }




        default:
            return state;
    }
}
export default notification;