import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CheckBox } from 'react-native-elements'



// import {AuthContext} from '../navigation/AuthProvider';

const FeedSettingsScreen = (props) => {
  const [email, setEmail] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [profileSetupDetails, setProfileSetupDetails] = useState({});



  useEffect(() => {
    getDataFromAS();

  }, [])

  const getDataFromAS = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up name from signup screen page: " + jsonObj.fullName)
      }
      let jsonValueTwo = await AsyncStorage.getItem('profileSetupDetails')
      let jsonObjTwo = jsonValueTwo != null ? JSON.parse(jsonValueTwo) : null;
      if (jsonObjTwo != null) {
        setProfileSetupDetails(jsonObjTwo)
        console.log("profile setup bio from profile setup page: " + jsonObjTwo.bio)
      }


    } catch (e) {
      console.log("error in feed setting page !!")
      console.log(e.message)
      // error reading value
    }
  }
  const check = () => {
    console.log(profileSetupDetails.date)
    console.log(signUpDetails.email)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>FeedSettingsScreen</Text>
      <View style={{ flexDirection: 'row' }}>

        <CheckBox
          style
          title='Want Help'
          checked={false}
        />
        <CheckBox
          title='Need Help'
          checked={false}
        />
        <CheckBox
          title='Both'
          checked={false}
        />
      </View>

      <FormButton
        buttonTitle="Sign Up"
      // onPress={() => props.navigation.navigate('ProfileSetup')}

      //  onPress={() => register(email, password)} go to - profile setup
      />

      <Button title='check  data from as'
        onPress={() => check()}
      />



      <TouchableOpacity
        style={styles.navButton}
        onPress={() => props.navigation.navigate('SignIn')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View >
  );
};

export default FeedSettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,

  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    margin: 40
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //  fontFamily: 'Lato-Regular',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  imageContainer: {
    padding: 20
  }

});
