import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
import Notification from '../components/Notification';
import User from '../components/User';
import { useFocusEffect } from '@react-navigation/native';
import { NO_NEW_NOTIFICATION } from '../../store/actions/types';
import { useSelector, useDispatch } from 'react-redux';




const Notifications = (props) => {

    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [restartScreen, setRestartScreen] = useState(false);
    let newNotificationFromRedux = useSelector(state => state.notification.newNotification);
    let userId = useSelector(state => state.auth.userId);
    const upcomingMeetingsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/meeting/getUpcomingMeetings/${userId}`
    const notificationsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getNotifications/${userId}`

    const noNewNotifications = async () => {
        //  console.log("trying to change redux msg recieved state...")
        // alert(3)
        dispatch({
            type: NO_NEW_NOTIFICATION,
            payload: null
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            noNewNotifications();
            let isActive = true;
            // setChatRooms([])

            const fetchUpcomingMeetings = async () => {
                console.log("Fetching chat rooms.!..")
                try {

                    const res = await axios(upcomingMeetingsFetchURL);
                    if (isActive) {
                        console.log("setting upcoming meetings ...")
                        //console.log(res.data)
                        setRestartScreen(!restartScreen)
                        setUpcomingMeetings(res.data);
                    }

                } catch (error) {
                    console.log(error)
                }

            }

            const fetchNotifications = async () => {
                console.log("Fetching notificions....")
                try {

                    const res = await axios.post(notificationsFetchURL);
                    if (isActive) {
                        console.log("setting notifications......")
                        console.log(res.data)
                        setNotifications(res.data)
                        //setRestartScreen(!restartScreen)
                        // setUpcomingMeetings(res.data);
                    }

                } catch (error) {
                    console.log(error)
                }

            }



            fetchNotifications();
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





    let notificationsHeader = notifications.length > 0 ? 'Notifications' : 'You are up to date !'

    return (

        <KeyboardAvoidingView style={styles.container}  >
            <ScrollView style={styles.inner}>
                {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
                <MyLinearGradient firstColor="#3b5998" secondColor="#3b5998" height={85} />


                <View style={styles.barContainer}><Text style={styles.barText}>Notifications</Text>

                </View>

                {upcomingMeetings.length > 0 ? <View style={styles.upcomingMeetingsHeader}><Text style={{ fontSize: 16 }}>Upcoming Meetings</Text></View> : null}
                <View style={styles.upcomingMeetingsContainer} key={restartScreen} >
                    {/* {console.log(chatRooms)} */}
                    {upcomingMeetings.map((meeting) => {
                        // console.log("upcoming meeting is: " + meeting)
                        return <Meeting meeting={meeting} key={meeting.otherMemberId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                        />


                    })}

                </View>
                <View style={styles.notificationsHeader}><Text style={{ fontSize: 16 }}>{notificationsHeader}</Text></View>
                <View style={styles.notificationContainer}>
                    {notifications.map((notification) => {
                        // console.log("notification is: " + notification)
                        return <Notification notification={notification} key={notification.notificationId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                        />
                    })}
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        //padding: windowHeight / 90,
        backgroundColor: '#f2f2f2',

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
        marginTop: windowHeight / 22,
        flexDirection: 'row',
        marginHorizontal: windowHeight / 40

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
        marginTop: windowHeight / 20,
        marginBottom: windowHeight / 40,

        alignItems: 'center'
    },
    upcomingMeetingsContainer: {
        // marginBottom: windowHeight / 10,
        backgroundColor: '#fff'
    },
    notificationContainer: {
        backgroundColor: '#fff'
    },
    notificationsHeader: {
        marginTop: windowHeight / 40,
        marginBottom: windowHeight / 35,

        alignItems: 'center',
    },
})
