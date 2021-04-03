import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen'
import MyProfileScreen from '../screens/MyProfileScreen'
import ChatScreen from '../screens/ChatScreen'
import PostPublishScreen from '../screens/PostPublishScreen'
import SearchScreen from '../screens/SearchScreen'
import Notifications from '../screens/Notifications';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';

import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'




const MainStackScreens = () => {

    const MainStack = createBottomTabNavigator();
    let userImage = useSelector(state => state.user.userImage);
    let newMessageFromRedux = useSelector(state => state.chat.receivedMessage);
    // let userImage = useSelector(state => state.user.userImage);


    const tabBarOptions = {
        showLabel: false,
        keyboardHidesTabBar: true,
        activeTintColor: '#2948ff',
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
                // case "MyProfile":
                //     iconName = "md-person"
                //     break;

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

            } if (route.name == "MyProfile") {
                return <Image
                    style={{ height: windowHeight / 28, width: windowHeight / 28, borderRadius: 20, marginTop: windowHeight / 90, marginRight: windowWidth / 40, marginBottom: windowHeight / 160 }}
                    source={{
                        uri: userImage,
                    }}
                />
            }
            //CHECK IN REDUX IF USER RECIEVED A MESSAGE
            if (route.name == "Chat" && newMessageFromRedux) {
                return <View >

                    <Badge
                        status="error"
                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />


                    <Ionicons name={iconName} size={24} color={focused ? "black" : "#666666"} />



                </View>
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