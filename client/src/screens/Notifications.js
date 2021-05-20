import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import MyOverlay from '../components/MyOverlay';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import Meeting from '../components/Meeting';
import Notification from '../components/Notification';
import { useFocusEffect } from '@react-navigation/native';
import { NO_NEW_NOTIFICATION } from '../../store/actions/types';
import { useSelector, useDispatch } from 'react-redux';
import { Appbar } from 'react-native-paper';
import Review from '../screens/Review';
import MeetingNotApprovedScreen from './MeetingNotApprovedScreen';
import { Toast } from "native-base";
import * as Font from "expo-font";
import Confetti from '../components/Confetti';



const Notifications = (props) => {

    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [wasFetched, setWasFetched] = useState(false);
    const [restartScreen, setRestartScreen] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [reviewObj, setReviewObj] = useState({});
    const [meetingDidntOccurObj, setMeetingDidntOccurObj] = useState({});

    let userId = useSelector(state => state.auth.userId);
    const upcomingMeetingsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/meeting/getUpcomingMeetings/${userId}`
    const notificationsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getNotifications/${userId}`

    const noNewNotifications = async () => {

        dispatch({
            type: NO_NEW_NOTIFICATION,
            payload: null
        });
    }

    const [meetingHappend, setMeetingHappend] = useState(false);
    const [isVisible, setIsvisible] = useState(false);
    const [meetingNotApproved, setMeetingNotApproved] = useState(false);


    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
            loadFonts();
        }


        if (meetingHappend) {
            setTimeout(() => {

                setIsvisible(true)
                setMeetingHappend(false)

            }, 2000);

        }



    }, [meetingHappend])


    useFocusEffect(
        React.useCallback(() => {
            noNewNotifications();
            let isActive = true;

            const fetchUpcomingMeetings = async () => {
                try {

                    const res = await axios(upcomingMeetingsFetchURL);
                    if (isActive) {
                        setRestartScreen(!restartScreen)
                        setUpcomingMeetings(res.data);
                    }

                } catch (error) {
                    console.log(error)
                }

            }


            const fetchNotifications = async () => {
                try {

                    const res = await axios.post(notificationsFetchURL);
                    if (isActive) {

                        setNotifications(res.data)

                    }
                    setWasFetched(true)

                } catch (error) {
                    console.log(error)
                }

            }

            fetchNotifications();
            fetchUpcomingMeetings()

            return () => {
                isActive = false;
            };
        }, [refreshPage])
    )



    const goToOtherUserProfile = (member_id) => {

        props.navigation.navigate('OtherUserProfileScreen', {
            userId: member_id
        })

    }
    const meetingApproveHanlder = (otherMemberImage, otherMemberName, otherMemberId) => {
        let obj = {
            otherMemberId,
            otherMemberImage,
            otherMemberName,
        }
        setReviewObj(obj)
        setMeetingHappend(true)
    }

    const meetingNotApproveHanlder = async (otherMemberName, otherMemberId, notificationId) => {
        let obj = {
            otherMemberId,
            otherMemberName,

        }
        setMeetingDidntOccurObj(obj)
        setMeetingNotApproved(true)



        // DELETE NOTIFICATION 
        const deleteNotificationUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/deletenotification/${notificationId}`


        try {
            const res = await axios.delete(deleteNotificationUrl);


        } catch (error) {
            console.log(error)
        }

    }

    const closeReview = () => {
        setIsvisible(false);
        setRefreshPage(!refreshPage)



        Toast.show({
            text: "Review published successfully",
            type: "success",
            duration: 4000
        });






    }


    const closeWindow = () => {

        setRefreshPage(!refreshPage);
        setMeetingNotApproved(false);


    }




    let notificationsHeader = notifications.length > 0 ? 'Notifications' : ""



    const animation = React.useRef(null)

    return (

        <KeyboardAvoidingView style={styles.container}  >


            <Appbar.Header style={{ backgroundColor: '#3b5998' }} >
                <Appbar.BackAction onPress={() => props.navigation.navigate('Home')} />

                <Appbar.Content title="Notifications" />
                <MyOverlay isVisible={isVisible} onBackdropPress={() => setIsvisible(false)}   >
                    <Review reviewObj={reviewObj} closeReview={() => closeReview()} />
                </MyOverlay>
                <MyOverlay isVisible={meetingNotApproved} onBackdropPress={() => setMeetingNotApproved(false)}   >
                    <MeetingNotApprovedScreen meetingDidntOccurObj={meetingDidntOccurObj} closeWindow={() => setMeetingNotApproved(false)} closeWindow={() => closeWindow()} />
                </MyOverlay>


            </Appbar.Header>

            {meetingHappend ? <Confetti /> : null}



            {
                upcomingMeetings.length == 0 && notifications.length == 0 && wasFetched ?
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/bell.png')}
                            style={styles.logo}
                        />
                        <Text style={{ fontSize: 20 }}>No notifications.</Text>
                    </View> : null
            }
            <ScrollView style={styles.inner}>



                {upcomingMeetings.length > 0 ? <View style={styles.upcomingMeetingsHeaderContainer}><Text style={styles.upcomingMeetingsHeader}>Upcoming Meetings</Text></View> : null}
                <View style={styles.upcomingMeetingsContainer} key={restartScreen} >
                    {upcomingMeetings.map((meeting) => {
                        return <Meeting meeting={meeting} key={meeting.otherMemberId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                        />


                    })}

                </View>
                <View style={styles.upcomingMeetingsHeaderContainer}><Text style={styles.upcomingMeetingsHeader}>{notificationsHeader}</Text></View>
                <View style={styles.notificationContainer}>
                    {notifications.map((notification) => {
                        return <Notification notification={notification} key={notification.notificationId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                            meetingApprovedBtn={(otherMemberImage, otherMemberName, otherMemberId) => meetingApproveHanlder(otherMemberImage, otherMemberName, otherMemberId)}
                            meetingNotApprovedBtn={(otherMemberName, otherMemberId, notificationId) => meetingNotApproveHanlder(otherMemberName, otherMemberId, notificationId)}
                        />
                    })}

                </View>

            </ScrollView>



        </KeyboardAvoidingView >
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1

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
    upcomingMeetingsHeaderContainer: {
        marginVertical: windowHeight / 50,

        alignItems: 'center'
    },
    upcomingMeetingsHeader: {
        fontSize: 18,
        color: '#3b5998'

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
    logo: {
        height: 120,
        width: 120,
        // marginBottom: windowHeight / 26.92121,
    },
    logoContainer: {
        marginTop: windowHeight / 4,
        justifyContent: 'center',
        alignItems: 'center',
        //     marginBottom: windowHeight / 80

    },
    lottie: {
        width: 500,
        height: 500,
        // position: 'absolute',
        // paddingRight: 200
    }
})
