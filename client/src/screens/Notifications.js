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
import Meeting from '../components/Meeting';
import User from '../components/User';
import { useFocusEffect } from '@react-navigation/native';


const Notifications = (props) => {

    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [restartScreen, setRestartScreen] = useState(false);
    let newMessageFromRedux = useSelector(state => state.chat.receivedMessage);
    let userId = useSelector(state => state.auth.userId);
    const upcomingMeetingsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/meeting/getUpcomingMeetings/${userId}`



    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            // setChatRooms([])

            const fetchUpcomingMeetings = async () => {
                console.log("Fetching chat rooms.!..")
                try {

                    const res = await axios(upcomingMeetingsFetchURL);
                    if (isActive) {
                        console.log("setting upcoming meetings ...")
                        console.log(res.data)
                        setRestartScreen(!restartScreen)
                        setUpcomingMeetings(res.data);
                    }

                } catch (error) {
                    console.log(error)
                }

            }
            fetchUpcomingMeetings()
            return () => {
                isActive = false;
            };
        }, [])
    )


    // const upcomingMeetingsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getroomchats/${userId}`
    // https://localhost:44303/api/meeting/getUpcomingMeetings/157



    // const chatRoomsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/${userId}`


    const goToOtherUserProfile = (member_id) => {

        props.navigation.navigate('OtherUserProfileScreen', {
            userId: member_id
        })

    }







    return (

        <KeyboardAvoidingView style={styles.container}  >
            <View style={styles.inner}>
                <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />


                <View style={styles.barContainer}><Text style={styles.barText}>Notifications</Text>

                </View>

                <View style={styles.upcomingMeetingsHeader}><Text>Upcoming Meetings</Text></View>
                <ScrollView key={restartScreen} >
                    {/* {console.log(chatRooms)} */}
                    {upcomingMeetings.map((meeting) => {
                        // console.log("upcoming meeting is: " + meeting)
                        return <Meeting meeting={meeting} key={meeting.otherMemberId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                        />
                        // return <ChatContact chatRoom={chatRoom} key={chatRoom.otherMemberId}
                        //     goToOtherUserChat={(chatRoomId, otherMemberName, otherMemberImage, otherMemberId)
                        //         => goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId)} />
                        // return <User user={user} key={user.memberId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />

                    })}
                </ScrollView>
                {/* <ChatContact />
                <ChatContact /> */}
            </View>

        </KeyboardAvoidingView>
    )
}

export default Notifications

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
    },
    upcomingMeetingsHeader: {
        marginTop: windowHeight / 100,
        alignItems: 'center'
    }
})
