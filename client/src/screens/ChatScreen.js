import React, { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import ChatContact from '../components/ChatContact';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';


const ChatScreen = (props) => {

    const [chatRooms, setChatRooms] = useState([]);
    const [restartScreen, setRestartScreen] = useState(false);
    let newMessageFromRedux = useSelector(state => state.notification.receivedMessage);
    const [wasFetched, setWasFetched] = useState(false);




    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetchChatRooms = async () => {
                try {

                    const res = await axios(chatRoomsFetchURL);
                    if (isActive) {
                        setRestartScreen(!restartScreen)
                        setChatRooms(res.data);
                        setWasFetched(true)

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
    const goToOtherUserChat = (chatRoomId, otherMemberName, otherMemberImage, otherMemberId) => {

        props.navigation.navigate('ChatWithOtherUser', {
            chatRoomId: chatRoomId,
            otherMemberName: otherMemberName,
            otherMemberImage: otherMemberImage,
            otherMemberId: otherMemberId

        })

    }
    return (

        <KeyboardAvoidingView style={styles.container}  >
            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }} >

                <Appbar.Content title="Chat" />
            </Appbar.Header>
            <View style={styles.inner}>
                {
                    chatRooms.length == 0 && wasFetched ?
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/noMessages.png')}
                                style={styles.logo}
                            />
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No messages, yet.</Text>
                            <View style={{ marginTop: windowHeight / 60, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 }}>No messages in your inbox, yet.</Text>
                                <Text style={{ fontSize: 16 }}>Start chetting with people around you.</Text>
                            </View>
                        </View> : null
                }


                <ScrollView key={restartScreen} >
                    {chatRooms.map((chatRoom) => {
                        return <ChatContact chatRoom={chatRoom} key={chatRoom.otherMemberId} goToOtherUserChat={(chatRoomId, otherMemberName, otherMemberImage, otherMemberId) => goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId)} />

                    })}
                </ScrollView>
            </View>

        </KeyboardAvoidingView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    inner: {
        padding: windowHeight / 45,
        flex: 1,
    },
    categoryContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 60,

    },

    barContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
        borderRadius: 50
    }, dropDownContainer: {

        width: '85%',
        height: windowHeight / 15,

    },
    filterICon: { marginLeft: 30, marginTop: 15 },

    chatContainer: {

    },
    userGreetingText: {
        fontSize: 18
    },

    logoContainer: {
        marginTop: windowHeight / 4,
        justifyContent: 'center',
        alignItems: 'center',

    }, logo: {
        height: 120,
        width: 120,
    },
})
