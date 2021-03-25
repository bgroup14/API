
import { View, StyleSheet, Button, Alert } from "react-native";
import { LOGIN_SUCCESS, REGISTER_SUCCESS, USER_LOGGED, IMAGE_UPDATED, FEED_SETTINGS_UPDATED } from './types';
import axios from 'axios';





export const updateImage = (pictureUri) => dispatch => {


    try {
        dispatch({
            type: IMAGE_UPDATED,
            payload: pictureUri
        });


    } catch (err) {


        Alert.alert(
            "Eroor!",
            [

                { text: "OK" }
            ],
        );

        console.log("register error" + err)

    }


}


export const updateFeedSettingsRedux = (feedSettings) => dispatch => {
    // export const updateFeedSettingsRedux = () => dispatch => {


    try {
        console.log("dispaching to feedstettings update")
        dispatch({
            type: FEED_SETTINGS_UPDATED,
            payload: feedSettings
            // payload: null
        });


    } catch (err) {


        Alert.alert(
            "Eroor!",
            [

                { text: "OK" }
            ],
        );

        console.log("register error" + err)

    }


}

















// //Login User

// export const login = (email, password) => async dispatch => {

//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }
//     const body = JSON.stringify({ email, password })


//     try {
//         //if this will fail (status !=200 ) it will catch the error in the error block
//         const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/login", body, config);

//         console.log(res);
//         console.log("res data (payload is:)")
//         console.log(res.data[0]);

//         dispatch({
//             type: LOGIN_SUCCESS,
//             //payload will be the what we recieve from the server
//             payload: res.data[0]
//         });

//         dispatch({
//             type: USER_LOGGED,
//             //payload will be the what we recieve from the server
//             payload: res.data[0]
//         });


//     } catch (err) {

//         Alert.alert(
//             "OOPS!",
//             "Wrong Email Or Password",
//             [

//                 { text: "OK" }
//             ],
//         );


//     }



// }

// export const register = (fullSignUpDetails) => async dispatch => {

//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }

//     }
//     const body = JSON.stringify(fullSignUpDetails)
//     console.log("Will register with body: " + body);

//     try {
//         //if this will fail (status !=200 ) it will catch the error in the error block
//         const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/register", body, config);

//         console.log(res.data);

//         console.log("res data (payload is:)")

//         dispatch({
//             type: REGISTER_SUCCESS,
//             //payload will be the what we recieve from the server
//             payload: res.data
//         });

//         dispatch({
//             type: USER_LOGGED,
//             //payload will be the what we recieve from the server
//             payload: res.data
//         });

//     } catch (err) {


//         Alert.alert(
//             "OOPS!",
//             "An error has occured sending the data",
//             [

//                 { text: "OK" }
//             ],
//         );

//         console.log("register error" + err)

//     }


// }

