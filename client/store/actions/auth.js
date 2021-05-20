
import { View, StyleSheet, Button, Alert } from "react-native";
import { LOGIN_SUCCESS, REGISTER_SUCCESS, USER_LOGGED } from './types';
import axios from 'axios';

//Login User

export const login = (email, password) => async dispatch => {


    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password })


    try {
        //if this will fail (status !=200 ) it will catch the error in the error block
        const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/login", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            //payload will be the what we recieve from the server
            payload: res.data[0]
        });

        dispatch({
            type: USER_LOGGED,
            //payload will be the what we recieve from the server
            payload: res.data[0]
        });


    } catch (err) {

        Alert.alert(
            "OOPS!",
            "Wrong email or password",
            [

                { text: "OK" }
            ],
        );


    }



}

export const register = (fullSignUpDetails) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }

    }
    const body = JSON.stringify(fullSignUpDetails)

    try {
        //if this will fail (status !=200 ) it will catch the error in the error block
        const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/register", body, config);



        dispatch({
            type: REGISTER_SUCCESS,
            //payload will be the what we recieve from the server
            payload: res.data
        });

        dispatch({
            type: USER_LOGGED,
            //payload will be the what we recieve from the server
            payload: res.data
        });

    } catch (err) {


        Alert.alert(
            "OOPS!",
            "An error has occured sending the data",
            [

                { text: "OK" }
            ],
        );

        console.log("register error" + err)

    }


}

