import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';




import MyLinearGradient from '../components/MyLinearGradient';





const HomeScreen = (props) => {

    let userName = useSelector(state => state.auth.userName);
    ///DELETE THIS!
    if (userName === null) {
        userName = 'Alan skverer'
    }
    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const createGreeting = () => {
        const hours = new Date().getHours(); //To get the Current Hours)
        if (hours > 0 && hours <= 5) {
            return "Good night"
        }
        else if (hours > 5 && hours <= 12) {
            return "Good morning"

        }
        else if (hours > 12 && hours <= 18) {
            return "Good afternoon"

        }
        return "Good evening"


    }

    let greeting = createGreeting();



    const userId = useSelector(state => state.auth.userId);

    return (
        <View style={styles.container}>

            <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
            {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={80} /> */}


            <View style={styles.barContainer}><Text style={styles.barText}>Feed</Text>
                <Icon
                    style={styles.bellIcon}
                    name='bell'
                    onPress={() => props.navigation.navigate('Notifications')}
                />
            </View>
            <View style={styles.userGreetingContainer}><Text style={styles.userGreetingText}> {greeting} {userFirstName}!</Text></View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}><Text>Heyy</Text></View>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}><Text>Heyy</Text></View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        // alignItems: 'center'
    },
    barContainer: {
        flex: 1,

        justifyContent: 'space-between',
        alignItems: 'center',
        //  marginLeft: 30,
        marginTop: 5,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 30

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',

    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    userGreetingContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    userGreetingText: {
        fontSize: 18
    }


})
