import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreens from './MainStackScreens';


//here we will have to chech from redux if user is logged in - if he is logged in we well show the mainStackScreens - else we show the auth screens

const user = 'logged1';
const AppStackScreens = () => {
    const AppStack = createStackNavigator();

    return (
        <AppStack.Navigator headerMode='none'>
            {user == 'logged' ?
                <AppStack.Screen name="Main" component={MainStackScreens} />
                : <AppStack.Screen name="Auth" component={AuthStackScreens} />}



        </AppStack.Navigator>
    )
}

export default AppStackScreens


