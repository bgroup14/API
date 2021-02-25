import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import HobbiesScreen from '../screens/HobbiesScreen';
import Header from '../shared/header'

const HobbiesStackScreens = () => {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator headerMode='screen'>
            <AuthStack.Screen name="HobbiesScreen" component={HobbiesScreen} options={{
                headerStyle: {
                    backgroundColor: '#0538EB'
                  },
                  headerTitle: <Header title='Hobbies' />
            }} />
        </AuthStack.Navigator>
    )
}

export default HobbiesStackScreens


