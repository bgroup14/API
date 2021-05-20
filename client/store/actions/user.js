
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

    try {
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













