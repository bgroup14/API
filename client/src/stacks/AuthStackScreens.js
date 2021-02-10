import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignupScreen'
import LoginScreen from '../screens/LoginScreen';

const AuthStackScreens = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator headerMode='none'>
            <AuthStack.Screen name="SignIn" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackScreens


