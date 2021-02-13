import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { Checkbox } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileSetup = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});


  useEffect(() => {
    getData();
  }, [])


  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up details from previous page: " + jsonObj.fullName)
      }

    } catch (e) {
      console.log("error !!")
      // error reading value
    }
  }

  const check = () => {
    console.log(signUpDetails.fullName)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Setup</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      <FormInput
        // labelValue={email}
        //   onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Full"
        iconType="user"
        //keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={email}
        //   onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        //   onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormInput
        //  labelValue={confirmPassword}
        //  onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />


      <FormButton
        buttonTitle="Next"
        onPress={() => props.navigation.navigate('FeedSettings')}

      //  onPress={() => register(email, password)} go to - profile setup
      />





      <TouchableOpacity
        style={styles.navButton}
        onPress={() => props.navigation.navigate('SignIn')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSetup;

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
