import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import MyOverlay from '../components/MyOverlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import Post from '../components/Post';
import ChatContact from '../components/ChatContact';
import User from '../components/User';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';


const ChatScreen = (props) => {

    const [chatRooms, setChatRooms] = useState([]);
    const [restartScreen, setRestartScreen] = useState(false);
    let newMessageFromRedux = useSelector(state => state.notification.receivedMessage);



    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            // setChatRooms([])

            const fetchChatRooms = async () => {
                console.log("Fetching chat rooms.!..")
                try {

                    const res = await axios(chatRoomsFetchURL);
                    if (isActive) {
                        console.log("setting chat rooms...")
                        console.log(res.data)
                        setRestartScreen(!restartScreen)
                        setChatRooms(res.data);
                    }

                } catch (error) {
                    console.log(error)
                }

            }
            fetchChatRooms()
            return () => {
                isActive = false;
            };
        }, [newMessageFromRedux])
    )


    let userId = useSelector(state => state.auth.userId);
    const chatRoomsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getroomchats/${userId}`



    // const chatRoomsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/${userId}`









    const goToOtherUserChat = (chatRoomId, otherMemberName, otherMemberImage, otherMemberId) => {

        props.navigation.navigate('ChatWithOtherUser', {
            chatRoomId: chatRoomId,
            otherMemberName: otherMemberName,
            otherMemberImage: otherMemberImage,
            otherMemberId: otherMemberId

        })

    }
    return (
        // <View style={styles.container}>
        //     <Text>ChatScreen </Text>
        // </View>
        <KeyboardAvoidingView style={styles.container}  >
            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }} >

                <Appbar.Content title="Chat" />
                {/* <Appbar.Action icon="bell" onPress={() => { props.navigation.navigate('Notifications') }} /> */}
                {/* <Appbar.Action icon={MORE_ICON} onPress={() => { }} /> */}
            </Appbar.Header>
            <View style={styles.inner}>
                {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
                {/* <MyLinearGradient firstColor="#3b5998" secondColor="#3b5998" height={90} />



                <View style={styles.barContainer}><Text style={styles.barText}>Chat</Text>

                </View> */}


                <ScrollView key={restartScreen} >
                    {/* {console.log(chatRooms)} */}
                    {chatRooms.map((chatRoom) => {
                        // console.log("chat room is: " + chatRoom)
                        return <ChatContact chatRoom={chatRoom} key={chatRoom.otherMemberId} goToOtherUserChat={(chatRoomId, otherMemberName, otherMemberImage, otherMemberId) => goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId)} />
                        // return <User user={user} key={user.memberId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />

                    })}
                </ScrollView>
                {/* <ChatContact />
                <ChatContact /> */}
            </View>

        </KeyboardAvoidingView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowHeight / 45,

        flex: 1,
        //  justifyContent: "space-around"
    },
    categoryContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 60,

    },

    barContainer: {
        // flex: 1,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //  marginLeft: 30,
        marginTop: windowHeight / 40,
        marginBottom: windowHeight / 30,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: windowHeight / 150
        // marginTop: windowHeight / 120

    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    selectCategoryContainer:
    {
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginBottom: 60,
        width: '100%',
        // marginLeft: windowWidth / 50,
        borderRadius: 50
    }, dropDownContainer: {

        width: '85%',
        height: windowHeight / 15,

    },
    filterICon: { marginLeft: 30, marginTop: 15 },

    chatContainer: {
        //    / flex: 1,
        //   minHeight: 140
        // justifyContent: '',
        //alignItems: 'center'
    },
    userGreetingText: {
        fontSize: 18
    }
})
