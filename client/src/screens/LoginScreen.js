import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

import { login } from '../../store/actions/auth';

import * as Facebook from 'expo-facebook';

import { LOGIN_SUCCESS } from '../../store/actions/types';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';


// import { useStateWithCallbackInstant } from 'use-state-with-callback'






//Redux
import { useSelector, useDispatch } from 'react-redux';


const LoginScreen = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();


  const dispatch = useDispatch();

  const storeData = async (value) => {
    try {
      console.log("storing in async storage...")
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
        console.log("res email is: ")
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
          //check if member exists on DB - if exusts will catch 
          await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/member/checkifmemberexists", body, config);
          // save in async storage
          let signUpDetails = {
            email: res.email,
            fullName: res.name,
            fbImage: res.picture.data.url
          }
          console.log("sign up details to async storage: ")
          console.log(signUpDetails)
          await storeData(signUpDetails);
          goToProfileSetup();



        } catch (error) {
          console.log("user email exists on db")
          //If email is in db - redirect to home screen with LOGIN_SUCCESS
          dispatch({
            type: LOGIN_SUCCESS,
            payload: email
          });
        }

      }
    }
    catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>RN Social App</Text>

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
        buttonTitle="Sign In"
        onPress={() => signIn()}
      />

      {/* <TouchableOpacity style={styles.forgotButton} onPress={() => { }}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      {/* {Platform.OS === 'android' ? ( */}
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

      <TouchableOpacity

        style={styles.forgotButton}
        onPress={() => props.navigation.navigate('SignUp')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
});
