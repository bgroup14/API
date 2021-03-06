import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignUpScreen'
import LoginScreen from '../screens/LoginScreen';

import ProfileSetup from '../screens/ProfileSetup';
import FeedSettingsScreen from '../screens/FeedSettingsScreen';
import Notifications from '../screens/Notifications';
import Header from '../shared/header'

const TestStack = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator headerMode='none' screenOptions={{
            headerStyle: { elevation: 0 },
            cardStyle: { backgroundColor: '#f2f2f2' }
            // cardStyle: { backgroundColor: '#f2f2f2' }
        }} >

            <AuthStack.Screen name="Notifications" component={Notifications} />
        </AuthStack.Navigator>
    )
}

export default TestStack


