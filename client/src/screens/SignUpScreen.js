import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
// import {AuthContext} from '../navigation/AuthProvider';

const SignupScreen = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  // const [confirmPassword, setConfirmPassword] = useState();

  // const {register} = useContext(AuthContext);

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
        //   onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Full Name"
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
        buttonTitle="Sign Up"
        onPress={() => props.navigation.navigate('ProfileSetup')}
      />





      <TouchableOpacity
        style={styles.navButton}
        onPress={() => props.navigation.navigate('SignIn')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

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
