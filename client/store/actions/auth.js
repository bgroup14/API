
import { View, StyleSheet, Button, Alert } from "react-native";
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from './types';
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

        console.log(res);
        console.log("res data (payload is:)")
        console.log(res.data);

        dispatch({
            type: LOGIN_SUCCESS,
            //payload will be the what we recieve from the server
            payload: res.data
        });

    } catch (err) {
        //  const errors = err.response.data.errors;
        //  console.log(err.response.data.msg)
        // if (errors) {

        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))

        //     );
        // } else {
        //     dispatch(setAlert(err.response.data.msg, 'danger'))
        // }

        // dispatch({
        //     type: LOGIN_FAIL,

        // });
        Alert.alert(
            "OOPS!",
            "Wrong Email Or Password",
            [

                { text: "OK" }
            ],
        );

        // console.log("error" + err.response.data) 

    }





    // return {

    //     type: "LOGIN_SUCCESS",
    //     payload: email
    // }

    //For async to work in dispatch i should add thunk redux
    // const url = "https://jsonplaceholder.typicode.com/todos/1"
    // const settings = {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     //body: JSON.stringify(data)
    // };
    // try {
    //     console.log("trying...")
    //     const fetchResponse = await fetch(url, settings);
    //     // console.log("tryy")
    //     console.log(fetchResponse)
    //     const data = await fetchResponse.json();
    //     console.log(data)
    //     console.log("succesful dispaching")

    //     return {

    //         type: "LOGIN_SUCCESS",
    //         payload: email
    //     }

    // } catch (e) {
    //     console.log("err")
    //     return e;
    // }





    //IF STATUS IS 200 else will be error and go to catch


}

export const register = (fullSignUpDetails) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            'data': JSON.stringify(fullSignUpDetails)
        }
    }
    const body = JSON.stringify(fullSignUpDetails)
    console.log("Will register with body: "+body);

    try {
        //if this will fail (status !=200 ) it will catch the error in the error block
        const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/register", body, config);

        console.log(res);
        console.log("res data (payload is:)")

        dispatch({
            type: REGISTER_SUCCESS,
            //payload will be the what we recieve from the server
            //payload: res.data
        });

    } catch (err) {
        //  const errors = err.response.data.errors;
        //  console.log(err.response.data.msg)
        // if (errors) {

        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))

        //     );
        // } else {
        //     dispatch(setAlert(err.response.data.msg, 'danger'))
        // }

        // dispatch({
        //     type: LOGIN_FAIL,

        // });
        Alert.alert(
            "OOPS!",
            "An error has occured sending the data",
            [

                { text: "OK" }
            ],
        );

        console.log("register error"+ err) 

    }


}

