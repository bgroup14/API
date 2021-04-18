import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackScreens from './AuthStackScreens';
import MainStackScreens from './MainStackScreens';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import Notifications from '../screens/Notifications';
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import EditProfile from '../screens/EditProfile';
import EditHobbiesScreen from '../screens/EditHobbiesScreen';
import EditFeedSettingsScreen from '../screens/EditFeedSettingsScreen';
import ChatWithOtherUser from '../screens/ChatWithOtherUser';
import { Fragment } from 'react';





//here we will have to chech from redux if user is logged in - if he is logged in we well show the mainStackScreens - else we show the auth screens

//
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
            {isLogged ? <Fragment>
                <AppStack.Screen name="Main" component={MainStackScreens} />
                <AppStack.Screen name="Notifications" component={Notifications} />
                <AppStack.Screen name="OtherUserProfileScreen" component={OtherUserProfileScreen} />
                <AppStack.Screen name="MyProfileScreen" component={MyProfileScreen} />
                <AppStack.Screen name="EditHobbiesScreen" component={EditHobbiesScreen} />
                <AppStack.Screen name="EditProfile" component={EditProfile} />
                <AppStack.Screen name="EditFeedSettingsScreen" component={EditFeedSettingsScreen} />
                <AppStack.Screen name="ChatWithOtherUser" component={ChatWithOtherUser} />

            </Fragment>
                :
                <AppStack.Screen name="Auth" component={AuthStackScreens} />}
        </AppStack.Navigator>
    )
}



export default AppStackScreens


