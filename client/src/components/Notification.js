import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-paper';
import axios from 'axios';




const Notification = (props) => {


    let userId = useSelector(state => state.auth.userId);
    const [notificationContent, setNotificationContent] = useState();
    const [iconType, setIconType] = useState();
    const [iconColor, setIconColor] = useState();
    const { notificationText, notificationType, otherMemberImage, unixdate, notificationDate,
        otherMemberId, otherMemberName, notificationId } = props.notification;

    var date = new Date(unixdate * 1000);
    var dateLabel = date.toLocaleDateString();




    useEffect(() => {

        setContent();
    }, [])





    const meetingApproved = async () => {
        props.meetingApprovedBtn(otherMemberImage, otherMemberName, otherMemberId);
        //Delete notification
        const deleteNotificationUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/deletenotification/${notificationId}`

        try {
            const res = await axios.delete(deleteNotificationUrl);

        } catch (error) {
            console.log(error)
        }

    }

    const meetingNotApproved = async () => {
        props.meetingNotApprovedBtn(otherMemberName, otherMemberId, notificationId);

    }




    const setContent = () => {

        switch (notificationType) {
            case "Comment":
                setNotificationContent(
                    <View style={{ maxWidth: windowWidth / 1.2 }}>
                        <Text style={{ marginTop: windowHeight / 150, fontWeight: 'bold' }}>Commented on your post: </Text>
                        <Text style={{ marginTop: windowHeight / 200, fontStyle: 'italic' }}>{notificationText} </Text>
                    </View>

                )
                setIconType("message1");
                setIconColor("#000000")

                break;

            case "MeetingAnswer":
                setNotificationContent(
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: windowHeight / 100 }}>{notificationText} </Text>
                    </View>
                )
                let iconType = notificationText.includes("Accepted") ? "like2" : "dislike2"
                setIconType(iconType)
                setIconColor("#000000")

                break;
            case "Review":
                setNotificationContent(
                    <View style={{ maxWidth: windowWidth / 1.2 }}>
                        <Text style={{ marginTop: windowHeight / 200, fontStyle: 'italic' }}>{notificationText} </Text>
                    </View>

                )
                setIconType("star")
                setIconColor("#f1c40f")


                break;
            case "meetingCheck":
                let arr = notificationText.split("for");
                let firstSentence = `${arr[0]}`;
                let secondSentence = arr[1];
                setNotificationContent(
                    <View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: windowHeight / 100 }}>{firstSentence} </Text>
                            <Text style={{ marginTop: windowHeight / 100 }}>for{secondSentence} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: windowHeight / 30 }}>


                            <Button style={{ marginHorizontal: windowWidth / 10 }} labelStyle={{ color: '#3b5998' }} icon="cancel" mode='outlined' onPress={() => meetingNotApproved()}>
                                No </Button>
                            <Button style={{ backgroundColor: '#3b5998' }} labelStyle={{ color: '#fff' }} icon="check" mode='contained' onPress={() => meetingApproved()}>
                                Yes</Button>
                        </View>

                    </View>)


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
                <Icon name={iconType} size={22} color={iconColor} style={{ position: 'absolute', marginLeft: windowWidth / 10, marginTop: windowHeight / 16 }} />


                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 60, }}>
                    <View style={styles.dateLabel}>
                        <Text>{notificationDate}</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.goToOtherUserProfile(otherMemberId)} >

                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                    </TouchableOpacity>


                    <View >
                        {notificationContent}
                    </View>
                </View>
            </View>
            <View  >

            </View>

            <View style={{ height: windowHeight / 100, backgroundColor: '#f2f2f2' }}></View>
        </View>

    )
}

export default Notification

const styles = StyleSheet.create({

    userContainer: {
        flexDirection: 'row',
        marginVertical: windowHeight / 70,
        marginBottom: windowHeight / 20
    },
    dateLabel: {
        width: windowWidth / 1.3,
        alignItems: 'flex-end'
    }
})
