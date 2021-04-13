import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';




const Notification = (props) => {


    // meetingDateLabel": "Apr/12/2021",
    // "meetingEventTitle": "Help in react native",
    // "meetingLocationLabel": "Zoom Meeting",
    // "meetingTimeLabel": "02:15",
    // "otherMemberId": 158,
    // "otherMemberImage": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
    // "otherMemberName": "LeBron James ",
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    let userId = useSelector(state => state.auth.userId);
    const [notificationContent, setNotificationContent] = useState();
    const [iconType, setIconType] = useState();

    // const [bold, setBold] = useState(false);


    const { notificationText, notificationType, otherMemberImage, unixdate,
        otherMemberId, otherMemberName } = props.notification;
    // console.log("notification type?: " + notificationType)
    // console.log("otherMemberName: " + otherMemberName)
    var date = new Date(unixdate * 1000);
    var dateLabel = date.toLocaleDateString();


    // setBold(false)
    // console.log("bold is set to: " + bold)

    useEffect(() => {

        setContent();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            console.log(dateLabel)
            // setBold(false)
            // console.log(bold)
            // console.log("last messenger id:" + lastMessageSenderId)
            // console.log("mark as read: " + lastMessageMarkedAsRead)
            // if (lastMessageSenderId != userId && !lastMessageMarkedAsRead) {

            //     console.log("setting to bold...")
            //     setBold(true)
            // }

        }, [])
    )


    const goTo = () => {
        // setBold(false);
        // props.goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId, otherMemberId)
    }


    const setContent = () => {

        switch (notificationType) {
            case "Comment":
                setNotificationContent(
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: windowHeight / 100, fontWeight: 'bold' }}>Commented on your post: </Text>
                        <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic' }}>{notificationText} </Text>
                    </View>

                )
                setIconType("message1")

                break;

            case "MeetingAnswer":
                setNotificationContent(
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: windowHeight / 100 }}>{notificationText} </Text>
                    </View>
                )
                let iconType = notificationText.includes("Accepted") ? "like2" : "dislike2"
                setIconType(iconType)
                break;




            default:
                break;
        }
    }


    return (
        <View>

            <View style={styles.userContainer}>

                <Avatar

                    size='medium'
                    containerStyle={{ marginTop: windowHeight / 80, marginLeft: windowWidth / 60 }}
                    rounded
                    source={{
                        uri:
                            otherMemberImage,
                    }}
                />
                <Icon name={iconType} size={22} color="#000000" style={{ position: 'absolute', marginLeft: windowWidth / 10, marginTop: windowHeight / 16 }} />


                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 60 }}>
                    <View style={styles.dateLabel}>
                        <Text>{dateLabel}</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.goToOtherUserProfile(otherMemberId)} >

                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                    </TouchableOpacity>

                    {/* Noification type : Comment */}

                    <View >

                        {notificationContent}
                        {/* <View style={{ flexDirection: 'row' }}>

                            <Text style={{ marginTop: windowHeight / 100, fontWeight: 'bold' }}>Commented on your post: </Text>
                            <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic' }}>"Great idea!" </Text>
                        </View> */}

                    </View>

                    {/* <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic', fontWeight: lastMessageSenderId != userId && !lastMessageMarkedAsRead ? 'bold' : 'normal' }}>{latstSentence}</Text> */}


                </View>




            </View>
            <View  >
                {/* <Text style={{ fontStyle: 'italic' }}>{meetingDateLabel} at {meetingTimeLabel}</Text> */}

            </View>
            {/* <Divider color='#e6e6e6' /> */}

            <View style={{ height: windowHeight / 100, backgroundColor: '#f2f2f2' }}></View>
        </View>

    )
}

export default Notification

const styles = StyleSheet.create({

    userContainer: {
        // flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 70,
        marginBottom: windowHeight / 20
    },
    dateLabel: {
        // backgroundColor: 'red',
        width: windowWidth / 1.3,
        alignItems: 'flex-end'
        // justifyContent:''
        // backgroundColor: 'red'
    }
})