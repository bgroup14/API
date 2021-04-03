import { NEW_MESSAGE, NO_NEW_MESSAGE } from '../actions/types';
const initialState = {

    receivedMessage: false
};

// this state name is counter! we define it in the combine reducer.
function chatReducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case NEW_MESSAGE:
            return {

                receivedMessage: true,

            }
        case NO_NEW_MESSAGE:
            return {

                receivedMessage: false,

            }



        default:
            return state;
    }
}
export default chatReducer;