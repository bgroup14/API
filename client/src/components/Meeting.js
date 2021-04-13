import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';




const Meeting = (props) => {


    // meetingDateLabel": "Apr/12/2021",
    // "meetingEventTitle": "Help in react native",
    // "meetingLocationLabel": "Zoom Meeting",
    // "meetingTimeLabel": "02:15",
    // "otherMemberId": 158,
    // "otherMemberImage": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
    // "otherMemberName": "LeBron James ",
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    let userId = useSelector(state => state.auth.userId);
    // const [bold, setBold] = useState(false);


    const { otherMemberName, otherMemberId, otherMemberImage, meetingEventTitle,
        meetingLocationLabel, meetingDateLabel, meetingTimeLabel } = props.meeting;
    console.log("event title??: " + meetingEventTitle)
    // setBold(false)
    // console.log("bold is set to: " + bold)

    useFocusEffect(
        React.useCallback(() => {
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
                <Icon name="calendar" size={22} color="#000000" style={{ position: 'absolute', marginLeft: windowWidth / 10, marginTop: windowHeight / 16 }} />

                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 60 }}>
                    <TouchableOpacity onPress={() => props.goToOtherUserProfile(otherMemberId)} >

                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                    </TouchableOpacity>

                    <View >
                        <Text style={{ marginTop: windowHeight / 100 }}>{meetingEventTitle}</Text>
                        <Text style={{ marginTop: windowHeight / 100 }}>In {meetingLocationLabel}</Text>
                        <Text style={{ marginTop: windowHeight / 100 }}>{meetingDateLabel} at {meetingTimeLabel}</Text>

                    </View>
                    {/* <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic', fontWeight: lastMessageSenderId != userId && !lastMessageMarkedAsRead ? 'bold' : 'normal' }}>{latstSentence}</Text> */}


                </View>




            </View>
            <View  >
                {/* <Text style={{ fontStyle: 'italic' }}>{meetingDateLabel} at {meetingTimeLabel}</Text> */}

            </View>

            {/* <Divider color='#e6e6e6' /> */}
            <View style={{ height: windowHeight / 100, backgroundColor: '#f2f2f2' }}>

            </View>
        </View>

    )
}

export default Meeting

const styles = StyleSheet.create({

    userContainer: {
        //flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 70,
        marginBottom: windowHeight / 20,
    }
})
