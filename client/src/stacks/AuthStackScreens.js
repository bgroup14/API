import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignUpScreen'
import LoginScreen from '../screens/LoginScreen';

import ProfileSetup from '../screens/ProfileSetup';
import FeedSettingsScreen from '../screens/FeedSettingsScreen';
import HobbiesScreen from '../screens/HobbiesScreen';
import Header from '../shared/header'

const AuthStackScreens = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator headerMode='none' screenOptions={{
            headerStyle: { elevation: 0 },
            // cardStyle: { backgroundColor: '#f2f2f2' }
            cardStyle: { backgroundColor: '#fff' }
        }} >
            <AuthStack.Screen name="SignIn" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="ProfileSetup" component={ProfileSetup} />
            <AuthStack.Screen name="FeedSettings" component={FeedSettingsScreen} />
            <AuthStack.Screen name="HobbiesScreen" component={HobbiesScreen} options={{
                headerStyle: {
                    backgroundColor: '#0538EB'
                },
                headerTitle: <Header title='Hobbies' />
            }} />
        </AuthStack.Navigator>
    )
}

export default AuthStackScreens


