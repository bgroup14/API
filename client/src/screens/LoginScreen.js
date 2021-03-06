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
      {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={1000} /> */}
      <MyLinearGradient firstColor="#ffffff" secondColor="#dfe9f3" height={1000} />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />

      </View>

      {/* <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24 }}>
          Welcome Back
        </Text>
      </View> */}

      <FormInput
        // labelValue={email}
        onChangeText={(text) => emailChangeHandler(text)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        //   labelValue={password}
        onChangeText={(text) => passwordChangeHanlder(text)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />




      <FormButton
        buttonTitle="Sign In!"
        onPress={() => signIn()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        <View>
          <Text style={{ width: 50, textAlign: 'center', fontSize: 16 }}>OR</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      </View>

      {/* <Text style={styles.text}>OR</Text> */}

      {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

          <TouchableOpacity onPress={() => alert(2)} style={{ marginHorizontal: 20 }}>
            <Image source={require('../../assets/google.png')} style={{ width: 60, height: 60 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => btnFBLogin()} style={{ marginHorizontal: 20 }}>
            <Image source={require('../../assets/facebook.png')} style={{ width: 60, height: 60 }} />
          </TouchableOpacity>

        </View> */}

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
          onPress={() => googleLogin()}
        />
      </View>
      {/* ) : null} */}
      <View style={{ flex: 1 }}>


      </View>

      <View style={{
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'flex-end'
      }}>
        <TouchableOpacity
          //style={styles.forgotButton}
          onPress={() => props.navigation.navigate('SignUp')}>
          <Text style={styles.navButtonText}>
            Don't have an acount? Create here
        </Text>

        </TouchableOpacity>
      </View>
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
    paddingTop: 20
  },
  logo: {

    // justifyContent: 'flex-end',
    height: 180,
    width: 200,
    //resizeMode: 'cover',
    marginBottom: 30,


  },
  logoContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight / 12

  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
    // marginVertical: 30,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginBottom: 200
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
    height: 500
  }
});
