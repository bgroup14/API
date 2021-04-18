import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';



const ChatContact = (props) => {
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    let userId = useSelector(state => state.auth.userId);
    // const [bold, setBold] = useState(false);


    const { otherMemberName, otherMemberId, otherMemberImage, latstSentence,
        lastDate, chatRoomId, lastMessageSenderId, lastMessageMarkedAsRead } = props.chatRoom;
    // console.log("read??: " + lastMessageMarkedAsRead)
    // setBold(false)
    // console.log("bold is set to: " + bold)

    useFocusEffect(
        React.useCallback(() => {
            // setBold(false)
            // console.log(bold)
            console.log("last messenger id:" + lastMessageSenderId)
            console.log("mark as read: " + lastMessageMarkedAsRead)
            // if (lastMessageSenderId != userId && !lastMessageMarkedAsRead) {

            //     console.log("setting to bold...")
            //     setBold(true)
            // }

        }, [])
    )


    const goToChatRoom = () => {
        // setBold(false);
        props.goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId, otherMemberId)
    }


    return (
        <TouchableOpacity onPress={() => goToChatRoom()}>

            <View style={styles.userContainer}>

                <Avatar

                    size='medium'
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            otherMemberImage,
                    }}
                />
                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 80 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                    <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic', fontWeight: lastMessageSenderId != userId && !lastMessageMarkedAsRead ? 'bold' : 'normal' }}>{latstSentence}</Text>


                </View>




            </View>
            <View style={{ alignItems: 'flex-end' }} >
                <Text style={{ fontStyle: 'italic' }}>{lastDate}</Text>

            </View>
            <Divider />
        </TouchableOpacity>

    )
}

export default ChatContact

const styles = StyleSheet.create({

    userContainer: {
        flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 30
    }
})
