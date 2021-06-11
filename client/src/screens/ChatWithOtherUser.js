import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import MyOverlay from '../components/MyOverlay';
import { Alert } from 'react-native';
import AddNotificationToDb from '../components/AddNotificationToDb';
import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import { Avatar } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import { NO_NEW_MESSAGE } from '../../store/actions/types';
import ScheduleMeeting from '../components/ScheduleMeeting';

const ChatWithOtherUser = (props) => {
    const { route, navigation } = props
    const scrollView = useRef()
    const [keyboadrdOpen, setKeyboadOpen] = useState(false);
    const { chatRoomId, otherMemberName, otherMemberImage, otherMemberId } = route.params;



    let userName = useSelector(state => state.user.userName);
    let userImage = useSelector(state => state.user.userImage);
    const [newMessage, setNewMessage] = useState();
    const [sentNewMessage, setSentNewMessage] = useState(false);
    const dispatch = useDispatch();
    const [isVisible, setIsvisble] = useState(false);
    let newMessageFromRedux = useSelector(state => state.notification.receivedMessage);





    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        scrollView.current.scrollToEnd()


        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, [keyboardStatus]);

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
    const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");








    useFocusEffect(
        React.useCallback(() => {
            scrollView.current.scrollToEnd()
            fetchChatHistory()
        }, [keyboardStatus, newMessageFromRedux, sentNewMessage])
    )
    let userId = useSelector(state => state.auth.userId);
    const [chatHistory, setChatHistory] = useState([]);
    const [restartComponent, setRestartComponent] = useState(1);




    const fetchChatHistoryUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatHistory/${chatRoomId}/${userId}`



    const scrollDown = () => {
        setTimeout(() => {
            scrollView.current.scrollToEnd()
        }, 300);


    }
    const fetchChatHistory = async () => {
        const res = await axios(fetchChatHistoryUrl);
        setChatHistory(res.data)
        if (res.data.length > 0) {
            markLastMassageRead()
        }
        scrollDown();
    }


    const markLastMassageRead = async () => {

        const markLastMassageReadUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/markLastMassageRead/${chatRoomId}/${userId}`
        try {
            const res = await axios.post(markLastMassageReadUrl);
            if (res.data == "Message marked as read") {

                //DISPATCH MESSAGE WAS READ
                dispatch({
                    type: NO_NEW_MESSAGE,
                    payload: null
                });

            }
        } catch (error) {
            console.log(error)
        }

    }


    const sendMessage = async () => {

        let newMessageToSend = {

            datetime: Math.round((new Date()).getTime() / 1000),
            fromMemberId: userId,
            toMemberId: otherMemberId,
            text: newMessage,
            chatRoomId
        }


        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }

            }
            let body = JSON.stringify(newMessageToSend);



            const sendChatMessageUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/sendChatMessage`

            let pushObj = {
                functionToRun: "receivedNewMessage",
                chatRoomId: chatRoomId,
                otherMemberName: userName,
                otherMemberId: userId,
                otherMemberImage: userImage

            }

            const res = await axios.post(sendChatMessageUrl, body, config);
            PushFromClient(pushObj)
            setRestartComponent(Date.now)



        }
        catch (error) {
            console.log(error)
        }


    }


    const PushFromClient = async (pushObj) => {

        //GET OTHER USER TOKEN ID FROM SERVER
        const fetchOtherUserPushNotificationID = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getnotificationid/${otherMemberId}`
        try {
            console.log(otherMemberId)
            const res = await axios(fetchOtherUserPushNotificationID);
            var otherUserNotificationId = res.data;

        } catch (error) {

            console.log(error)
            console.log("erorr!!")
            return null
        }

        var body = newMessage;

        switch (pushObj.functionToRun) {
            case "receivedNewMeetingInvitation":
                body = `sent you meeting invitation`
                break;
            case "meetingApproved":
                body = `Accepted your meeting invitation`
                break;
            case "meetingRejected":
                body = `Rejected your meeting invitation`
                break;
            default:
                break;
        }



        let push = {
            to: otherUserNotificationId,
            // to: "ExponentPushToken[bd3PgHK1A50SU4Iyk3fNpX]",
            title: userName,
            body: body,
            badge: 3,
            data: pushObj,



        };

        // POST adds a random id to the object sent
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(push),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                  returned from server\n
                  json.data= ${JSON.stringify(json.data)}`);

                } else {
                    alert('err json');
                }
            });
    }

    const meetingAnswer = async (answer) => {

        ///HERE IF ANSWER == Accept I SHOULD SET A MEETING AND GET MEETINGS DETAILS (UNIXDATE, MEETING TITLE) CHECK WHICH VALUES SHOULD BE STORED IN DB TOO 
        ///FROM C# CHEKING THOSE DEAILS WITH THE CHATROOMID WHEN MEETINGMSG==TRUE(SINCE WE SHOULD HAVE ONLY 1 MEETINGMSG PER ROOM AT ANY TIME)
        ///THEN TAKE THOSE VALUES AND SAVE IN DB AS A MEETING
        if (answer == "Accept") {

            try {
                const createMeetingUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/createMeeting/${chatRoomId}`
                const res = await axios.post(createMeetingUrl);

                if (res.status == 200) {
                    //This will rerender component
                    setSentNewMessage(!sentNewMessage)
                    Alert.alert(
                        "Meeting created",
                        "You can watch your upcoming meetings in the notifications screen",
                        [
                            {
                                text: "OK",
                            }
                        ],
                    );
                }

            } catch (error) {
                console.log(error)
            }

            try {
                const deleteMeetingMessageUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/deleteMeetingMessage/${chatRoomId}`
                const res = await axios.delete(deleteMeetingMessageUrl);


            } catch (error) {
                console.log(error)
            }

            let pushObj = {
                functionToRun: "meetingApproved",

            }

            PushFromClient(pushObj)

            let now = Math.floor(Date.now() / 1000)
            let notificationText = `Accepted your meeting invitation`
            let obj = {
                memberId: otherMemberId,
                notificationType: 'MeetingAnswer',
                notificationText: notificationText,
                otherMemberId: userId,
                unixdate: now
            }

            AddNotificationToDb(obj)



        }
        else if (answer == "Reject") {




            try {
                const deleteMeetingMessageUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/deleteMeetingMessage/${chatRoomId}`
                const res = await axios.delete(deleteMeetingMessageUrl);


                if (res.status == 200) {
                    //This will rerender component
                    setSentNewMessage(!sentNewMessage)
                    Alert.alert(
                        "",
                        "Meeting rejected",
                        [
                            {
                                text: "OK",
                            }
                        ],
                    );
                }

            } catch (error) {
                console.log(error)
            }



            let pushObj = {
                functionToRun: "meetingRejected",


            }
            PushFromClient(pushObj)

            let now = Math.floor(Date.now() / 1000)
            let notificationText = `Rejected your meeting invitation`
            let obj = {
                memberId: otherMemberId,
                notificationType: 'MeetingAnswer',
                notificationText: notificationText,
                otherMemberId: userId,
                unixdate: now
            }

            AddNotificationToDb(obj)







        }



    }

    const goToOtherUserProfile = (member_id) => {

        if (userId == member_id) {
            props.navigation.navigate('MyProfile')
        }
        else {
            props.navigation.navigate('OtherUserProfileScreen', {
                userId: member_id
            })
        }
    }

    const inviteMeeting = async (dateObj) => {
        setNewMessage(null)
        let now = Math.floor(Date.now() / 1000)
        setIsvisble(false)
        let fromMemberId = userId;
        let toMemberId = otherMemberId;
        const meetingMsg = true;
        let meetingMsgDetails = {

            ...dateObj,
            chatRoomId,
            datetime: now,
            fromMemberId,
            toMemberId,
            meetingMsg
        }
        let body = JSON.stringify(meetingMsgDetails);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }

            }




            const sendChatMessageUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/sendChatMessage`


            const res = await axios.post(sendChatMessageUrl, body, config);

            let pushObj = {
                functionToRun: "receivedNewMeetingInvitation",
                chatRoomId: chatRoomId,
                otherMemberName: userName,
                otherMemberId: userId,
                otherMemberImage: userImage

            }
            PushFromClient(pushObj)
            setSentNewMessage(!sentNewMessage)
            setRestartComponent(Date.now)



        }
        catch (error) {
            console.log(error)
        }


    }

    return (
        <KeyboardAvoidingView style={styles.container} key={restartComponent}>


            <View style={styles.inner}>
                <MyLinearGradient firstColor="#3b5998" secondColor="#3b5998" height={90} />
                <KeyboardAvoidingView>
                    <MyOverlay isVisible={isVisible} onBackdropPress={() => setIsvisble(false)}  >
                        <ScheduleMeeting receiveDateFromDatePicker={(dateObj) => inviteMeeting(dateObj)} closeMeeting={() => setIsvisble(false)} />

                    </MyOverlay>
                </KeyboardAvoidingView>

                <View >
                    <View>
                        <View style={styles.barContainer} >

                            <Avatar
                                size='small'

                                rounded
                                source={{
                                    uri:
                                        otherMemberImage
                                }}
                            />
                            <TouchableOpacity onPress={() => goToOtherUserProfile(otherMemberId)}>
                                <Text style={styles.barText}>{otherMemberName}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.IconContainer}>
                            <Icon
                                style={styles.bellIcon}
                                name='calendar'
                                onPress={() => setIsvisble(true)}
                            />
                        </View>
                    </View>

                </View>


                <ScrollView style={{ marginTop: windowHeight / 20 }} ref={scrollView} >

                    {chatHistory.map((message) => {

                        return <MessageBubble message={message} mine={!message.mine} text={message.text}
                            key={message.messageId} otherMemberName={otherMemberName} meetingAnswer={(answer) => meetingAnswer(answer)}
                        />

                    })}


                </ScrollView>

                <View style={styles.messageContainer} >
                    <TextInput onFocus={() => scrollView.current.scrollToEnd()} autoFocus={false} placeholder="Type a message..." multiline={true}
                        style={styles.commentInput} numberOfLines={3}
                        onChangeText={(text => setNewMessage(text))} />
                    <TouchableOpacity onPress={() => sendMessage()}>
                        <FontAwsome name='send-o' color='blue' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View>

            </View>


        </KeyboardAvoidingView >
    )
}

export default ChatWithOtherUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    inner: {
        padding: windowHeight / 45,

        flex: 1,
    },
    barContainer: {

        alignItems: 'center',
        marginTop: windowHeight / 32,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    IconContainer: {

        justifyContent: 'flex-end',
        position: 'absolute',
        marginLeft: windowWidth / 1.3,
        marginTop: windowHeight / 26,



    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: windowWidth / 30
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    commentInput: {
        maxWidth: '90%'
    },
    messageContainer: {
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: windowWidth / 70,
        height: 60,
        borderRadius: 20
    }

})
