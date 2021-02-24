import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CheckBox } from 'react-native-elements'



// import {AuthContext} from '../navigation/AuthProvider';

const FeedSettingsScreen = (props) => {
  const [userType, setUserType] = useState();
  const [postsLocation, setPostsLocation] = useState();
  const [fromGender, setFromGender] = useState();
  const [fromAge, setFromAge] = useState();
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
    console.log(signUpDetails.fullName)
  }


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>FeedSettingsScreen</Text>
        <Text>Do you</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox
            title='Want To Help'
            checked={userType == 1}
            onPress={() => userType != 1 ? setUserType(1) : setUserType(null)}

          />
          <CheckBox
            title='Need Help'
            checked={userType == 2}
            onPress={() => userType != 2 ? setUserType(2) : setUserType(null)}

          />
          <CheckBox
            title='Both'
            checked={userType == 3}
            onPress={() => userType != 3 ? setUserType(3) : setUserType(null)}

          />
        </View>


        <Text>Post's Location</Text>


        <View style={styles.radioBtnContainer}>

          <CheckBox
            title='My Area'
            checked={postsLocation == 1}
            onPress={() => postsLocation != 1 ? setPostsLocation(1) : setUserType(null)}

          />
          <CheckBox
            title='30KM'
            checked={postsLocation == 2}
            onPress={() => postsLocation != 2 ? setPostsLocation(2) : setPostsLocation(null)}

          />
          <CheckBox
            title='All Country'
            checked={postsLocation == 3}
            onPress={() => postsLocation != 3 ? setPostsLocation(3) : setPostsLocation(null)}

          />
        </View>
        <Text>From Who</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox
            title='Man'
            checked={fromGender == 1}
            onPress={() => fromGender != 1 ? setFromGender(1) : setFromGender(null)}

          />
          <CheckBox
            title='Woman'
            checked={fromGender == 2}
            onPress={() => fromGender != 2 ? setFromGender(2) : setFromGender(null)}

          />
          <CheckBox
            title="Dosen't Matter"
            checked={fromGender == 3}
            onPress={() => fromGender != 3 ? setFromGender(3) : setFromGender(null)}

          />
        </View>
        <Text>Volunteer's Age</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox
            title='Want To Help'
            checked={fromAge == 1}
            onPress={() => fromAge != 1 ? setFromAge(1) : setFromAge(null)}

          />
          <CheckBox
            title='Need Help'
            checked={fromAge == 2}
            onPress={() => fromAge != 2 ? setFromAge(2) : setFromAge(null)}

          />
          <CheckBox
            title='Both'
            checked={fromAge == 3}
            onPress={() => fromAge != 3 ? setFromAge(3) : setFromAge(null)}

          />
        </View>


        <FormButton
          buttonTitle="Complete Sign Up"
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
      </ View>
    </ScrollView>
  );
};

export default FeedSettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    alignItems: 'center',
    padding: 15,

  },
  radioBtnContainer: {
    // flexDirection: 'row',
    //flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#ccc',
    //justifyContent: 'flex-start',
    marginVertical: 15,
    width: '100%',



  }
  ,
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
