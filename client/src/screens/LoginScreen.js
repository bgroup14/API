import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { login } from '../../store/actions/auth';
import * as Facebook from 'expo-facebook';
import { LOGIN_SUCCESS, USER_LOGGED } from '../../store/actions/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Expo from "expo"
// import * as Google from 'expo-google-app-auth'
// import { Google } from "expo"
import { useSelector, useDispatch } from 'react-redux';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';


const LoginScreen = (props) => {

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '240686007874-ltqlbg8u1cukrmam7v1ehp2j85la3oml.apps.googleusercontent.com',
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // androidClientId: '240686007874-uorsqm1u8mv4vmitqb2jonb9ngemmd5o.apps.googleusercontent.com',
    // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    scopes: ["email"]
  });


  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // console.log(response.authentication.accessToken)
      // console.log(response)
      // console.log("success")
      googleLogin(response.authentication.accessToken);

    }
  }, [response]);



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
          dispatch({
            type: LOGIN_SUCCESS,
            //payload will be the what we recieve from the server
            payload: res.data[0]
          });

          console.log("facebook res data")
          console.log(res.data)
          dispatch({
            type: USER_LOGGED,
            //payload will be what we recieve from the server
            payload: res.data[0]
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
              "General error, please try again.",
              [
                { text: "OK" }
              ],
            );

          }

        }

      }
    }
    catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }


  const googleLogin = async (token) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
      // console.log("google login: ")
      // console.log(res.data.email);



      const url = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/checkifmemberexists";

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }



      let bodyObj = {
        email: res.data.email
      }
      const body = JSON.stringify(bodyObj)


      //Check if user already has been registered - if he did, redirect to feed. if not - redirect to profile setup
      try {
        //check if member  exists on DB - if  dosent exists will catch  400 or 500 error
        let res = await axios.post(url, body, config);
        console.log("after ruppin...")
        console.log(res.data[0])
        dispatch({
          type: LOGIN_SUCCESS,
          //payload will be the what we recieve from the server
          payload: res.data[0]
        });

        dispatch({
          type: USER_LOGGED,
          //payload will be what we recieve from the server
          payload: res.data[0]
        });




      } catch (error) {
        console.log("erorr!")
        // if error code is 400 - user email not in db so redirect to profie setup 
        if (error.response.status == 400) {
          let signUpDetails = {
            email: res.data.email,
            fullName: res.data.name,
            fbImage: res.data.picture
          }
          await storeData(signUpDetails);
          goToProfileSetup();
        }
        else if (error.response.status == 500) {
          Alert.alert(
            "OOPS!",
            "General error, please try again.",
            [
              { text: "OK" }
            ],
          );

        }

      }


    } catch (e) {
      console.log("error", e)
    }
  }




  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.jpg')}
          style={styles.logo}
        />

      </View>

      <FormInput
        onChangeText={(text) => emailChangeHandler(text)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        onChangeText={(text) => passwordChangeHanlder(text)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => signIn()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        <View>
          <Text style={{ width: 50, textAlign: 'center', fontSize: 16 }}>OR</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      </View>

      <View>
        <SocialButton
          buttonTitle="Sign In with Facebook"
          btnType="facebook"
          color="#4867aa"
          backgroundColor="#e6eaf4"
          onPress={() => btnFBLogin()}
        />

        <SocialButton
          buttonTitle="Sign In with Google"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => promptAsync()}
        // onPress={() => googleLogin()}
        />
      </View>

      <View style={styles.forgetBtnContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('SignUp')}>
          <Text style={styles.navButtonText}>
            Don't have an acount? Create here
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: windowHeight / 40.381815,
    maxHeight: windowHeight + 200,
    backgroundColor: '#fff'
  },
  logo: {
    height: windowHeight / 3.2,
    width: windowHeight / 1.8,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',

  },


  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  forgetBtnContainer: {
    flex: 1,
    justifyContent: 'center'
  }

});