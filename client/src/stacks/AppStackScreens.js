import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreens from './MainStackScreens';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import Notifications from '../screens/Notifications';
import { Fragment } from 'react';



//here we will have to chech from redux if user is logged in - if he is logged in we well show the mainStackScreens - else we show the auth screens

// const user = 'logged1';
const AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const isLogged = useSelector(state => state.auth.isLogged)
    // const isLogged = true;

    return (
        // <AppStack.Navigator headerMode={isLogged ? 'none' : 'none'}>
        //     {!isLogged ?
        //         <AppStack.Screen name="Main" component={MainStackScreens} />
        //         : <AppStack.Screen name="Auth" component={AuthStackScreens} />}
        // </AppStack.Navigator>

        <AppStack.Navigator headerMode={isLogged ? 'none' : 'none'}>
            {!isLogged ? <Fragment>
                <AppStack.Screen name="Main" component={MainStackScreens} />
                <AppStack.Screen name="Notifications" component={Notifications} />
            </Fragment>
                :
                <AppStack.Screen name="Auth" component={AuthStackScreens} />}
        </AppStack.Navigator>
    )
}



export default AppStackScreens


