import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignUpScreen'
import LoginScreen from '../screens/LoginScreen';
import ProfileSetup from '../screens/ProfileSetup';
import FeedSettingsScreen from '../screens/FeedSettingsScreen';

const AuthStackScreens = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator headerMode='none'>
            <AuthStack.Screen name="SignIn" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="ProfileSetup" component={ProfileSetup} />
            <AuthStack.Screen name="FeedSettings" component={FeedSettingsScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackScreens


