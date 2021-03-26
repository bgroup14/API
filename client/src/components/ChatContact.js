import { text } from '@fortawesome/fontawesome-svg-core';
import React, { useState } from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';


const ChatContact = (props) => {
    //For testing
    let member_id = 2;
    //let currentMemberId = 2;
    //const { messageId, datetime, notificationId, fromMemberId, toMemberId } = props.chat;

    let currentMemberId = props.currentMemberId;
    console.log("current member id is: " + currentMemberId);
    let userId = useSelector(state => state.auth.userId);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.chatContactContainer}>
                <Avatar

                    size='large'
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
                    }}
                />
                <View style={styles.chatDetailsContainer}>
                    <View style={styles.userNameContainer}>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate('OtherUserProfileScreen', {
                            userId: member_id
                        })}> */}
                        <TouchableOpacity onPress={() => props.goToOtherUserProfile(fromMemberId)}>
                            <Text style={styles.userName}>Username</Text>

                        </TouchableOpacity>


                    </View>
                    <Text style={styles.postText}>Message text test</Text>
                </View>



                {/* </View> */}

            </View>
            



            <Divider style={{ height: 1.5 }} />


        </KeyboardAvoidingView>

    )
}

export default ChatContact

const styles = StyleSheet.create({

    container: {
        marginVertical: 10,
        flex: 1,
        //  flexDirection: 'row',
        // justifyContent: 'flex-end',
        //  alignItems: 'flex-start'
    },
    chatContactContainer: {
        flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        alignItems: 'flex-start',
        maxHeight: 100

    },
    chatDetailsContainer: {
        flex: 1,
        //justifyContent: 'flex-start',
        //justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 10,
        maxWidth: windowWidth / 1.8,


        // alignItems: 'center'

    },
    userNameContainer: {
        //margin: 2
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userName:
    {
        fontSize: 16,
        fontWeight: 'bold'
    },
    postText: {
        // fontSize: 14
    },
    postDateText: {
        // color: 'red'
        color: 'black'
    },
    postCityName: {
        color: 'blue'

    },
    postBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 5,
        marginTop: 10

    },
    postBtn: {
        //  flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 10
    },
    btnText: { marginLeft: 5 },
    commentsContainer:
    {
        //marginTop: 1,
        marginBottom: 4,
        alignItems: 'flex-end'
    },

    // userImageContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     alignItems: 'center'

    // },
    userImage: {
        // width: 100,
        // height: 100

    }, commentContainer: {
        // flex 1,
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        height: 60
        // justifyContent: 'flex-start'
    },
    commentInput: {
        maxWidth: '85%'
    }

})
