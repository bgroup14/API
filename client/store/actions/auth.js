
import LOGIN_SUCCESS from './types';
//Login User
export const login = (userName) => {
    return {

        type: "LOGIN_SUCCESS",
        //payload will be the token we recieve from the server
        payload: userName
    }

    //IF STATUS IS 200 else will be error and go to catch


}

