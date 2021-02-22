import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {AuthContext} from '../navigation/AuthProvider';

const SignupScreenTest = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const emailChangeHandler = (text) => {
    setEmail(text);
  }
  const passwordChangeHanlder = (text) => {
    setPassword(text);
  }
  const confirmPasswordChangeHanlder = (text) => {
    setConfirmPassword(text);
  }
  const fullNameChangeHanlder = (text) => {
    setFullName(text);
  }
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('signUpDetails', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const signUn = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "OOPS!",
        "Password dosen't match, try again",
        [
          { text: "OK" }
        ],
      );
      return null;
    }
    const url = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/checkifmemberexists";

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ email })
    try {

      //check if member exists on DB
      const res = await axios.post(url, body, config);
      Alert.alert(
        "OOPS!",
        "An account with this email already exists",
        [
          { text: "OK" }
        ],
      );
      console.log(res.status)
      // save in async storage


      //prop nav to profile setup




    } catch (err) {

      if (err.response.status == 400) {
        let signUpDetails = {
          email,
          password,
          fullName
        }
        //  console.log(signUpDetails)
        storeData(signUpDetails).then(
          props.navigation.navigate('ProfileSetup')
        );

      }
      else if (err.response.status == 500) {
        Alert.alert(
          "OOPS!",
          "General error, try again",
          [
            { text: "OK" }
          ],
        );
        console.log("error is:")
        console.log(err.response)
      }



    }

  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      <FormInput
        // labelValue={email}
        onChangeText={(text) => fullNameChangeHanlder(text)}
        placeholderText="Full Name"
        iconType="user"
        //keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        req
      />

      <FormInput
        labelValue={email}
        onChangeText={(text) => emailChangeHandler(text)}
        placeholderText="Email"
        iconType="envelope"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(text) => passwordChangeHanlder(text)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormInput
        //  labelValue={confirmPassword}
        onChangeText={(text) => confirmPasswordChangeHanlder(text)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign Up"
        //  onPress={() => register(email, password)} go to - profile setup
        onPress={() => signUn()}
      />





      <TouchableOpacity
        style={styles.navButton}
        onPress={() => props.navigation.navigate('SignIn')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreenTest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,

  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
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
    //fontFamily: 'Lato-Regular',
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
