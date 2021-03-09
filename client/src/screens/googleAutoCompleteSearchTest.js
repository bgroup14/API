import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
  TextInput
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import { login } from '../../store/actions/auth';

import * as Facebook from 'expo-facebook';

import { LOGIN_SUCCESS } from '../../store/actions/types';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';


import { LinearGradient } from 'expo-linear-gradient';





// import { useStateWithCallbackInstant } from 'use-state-with-callback'






//Redux
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import MyLinearGradient from '../components/MyLinearGradient';
import GooglePlacesInput from '../components/GooglePlacesInput';


const LoginScreen = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();


  const dispatch = useDispatch();

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('signUpDetails', jsonValue)
    } catch (e) {
      // saving error
    }
  }


  const signIn = () => {
    console.log(windowHeight)
    dispatch(login(email, password));

  }

  const emailChangeHandler = (text) => {
    setEmail(text);
  }
  const passwordChangeHanlder = (text) => {
    setPassword(text);
  }
  const goToProfileSetup = () => {
    props.navigation.navigate('ProfileSetup')
  }

  async function btnFBLogin() {
    let appId = '221942186335440';
    let appName = 'VolunteerMatch'
    try {
      await Facebook.initializeAsync(({ appId, appName }));
      const { type, token, expires, permissions, declinedPermissions, }
        = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&
    access_token=${token}`);
        let res = await response.json();
        console.log("facebook email is: ")
        console.log(res.email);
        const url = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/checkifmemberexists";

        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        let bodyObj = {
          email: res.email
        }
        const body = JSON.stringify(bodyObj)


        //Check if user already has been registered - if he did, redirect to feed. if not - redirect to profile setup
        try {
          //check if member  exists on DB - if  dosent exists will catch  400 or 500 error
          let res = await axios.post(url, body, config);
          //If email is in  db - redirect to home screen with LOGIN_SUCCESS and send the user details from server as payload 
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
          });


        } catch (error) {
          // if error code is 400 - user email not in db so redirect to profie setup 
          if (error.response.status == 400) {
            let signUpDetails = {
              email: res.email,
              fullName: res.name,
              fbImage: res.picture.data.url
            }
            await storeData(signUpDetails);
            goToProfileSetup();

          }
          else if (error.response.status == 500) {
            Alert.alert(
              "OOPS!",
              "General error, try again",
              [
                { text: "OK" }
              ],
            );
            console.log("error is:")
            console.log(error.response)
          }





        }

      }
    }
    catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }


  //firstColor="#a1c4fd" secondColor="#c2e9fb"
  return (

    // <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      <GooglePlacesInput />




    </View>
    // </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#e6f2ff',
    //justifyContent: 'center',
    alignItems: 'center',
    //  padding: 20,
    paddingTop: windowHeight / 40.381815,
    maxHeight: windowHeight + 200
  },
  logo: {

    // justifyContent: 'flex-end',
    height: windowHeight / 4.486868333,
    width: windowHeight / 4.0381815,
    //resizeMode: 'cover',
    marginBottom: windowHeight / 26.92121,


  },
  logoContainer: {
    marginTop: windowHeight / 26.92121,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10

  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 20,
    marginTop: windowHeight / 26.92121,
    marginBottom: windowHeight / 40.381815,
    // marginVertical: 30,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginBottom: windowHeight / 4.0381815
    //marginVertical: 35,

  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight
  }
});