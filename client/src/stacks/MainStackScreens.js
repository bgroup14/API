import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen'
import MyProfileScreen from '../screens/MyProfileScreen'
import ChatScreen from '../screens/ChatScreen'
import PostPublishScreen from '../screens/PostPublishScreen'
import SearchScreen from '../screens/SearchScreen'
import Notifications from '../screens/Notifications';

import { createStackNavigator } from '@react-navigation/stack';


const MainStackScreens = () => {

    const MainStack = createBottomTabNavigator();

    const tabBarOptions = {
        showLabel: false,
        style: {
            backgroundColor: '#fff',
        }
    }

    const screenOptions = (({ route }) => ({


        tabBarIcon: ({ focused }) => {
            let iconName = "ios-home"

            switch (route.name) {
                case "Home":
                    iconName = "ios-home"
                    break;
                case "Chat":
                    iconName = "chatbubbles-outline"
                    break;

                case "Search":
                    iconName = "search"
                    break;
                case "MyProfile":
                    iconName = "md-person"
                    break;

                default:
                    iconName = "ios-home"
                    break;
            }
            if (route.name == "PostPublish") {
                return <Ionicons name='add-circle' size={42} color="#2948ff"
                    style={{
                        shadowColor: '#23a8d9',
                        shadowOffset: { width: 0, height: 10 },
                        shadowRadius: 10,
                        shadowOpacity: 0.3
                    }} />

            }



            return <Ionicons name={iconName} size={24} color={focused ? "black" : "#666666"} />
        }
    }))



    return (

        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}  >
            <MainStack.Screen name="Home" component={HomeScreen} options={{ title: 'My home' }} />
            <MainStack.Screen name="Search" component={SearchScreen} options={{ title: 'My home' }} />
            <MainStack.Screen name="PostPublish" component={PostPublishScreen} />
            <MainStack.Screen name="Chat" component={ChatScreen} />
            <MainStack.Screen name="MyProfile" component={MyProfileScreen} />
        </MainStack.Navigator>


    )
}
export default MainStackScreens;