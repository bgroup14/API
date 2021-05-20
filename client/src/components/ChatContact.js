import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';


const ChatContact = (props) => {
    let userId = useSelector(state => state.auth.userId);


    const { otherMemberName, otherMemberId, otherMemberImage, latstSentence,
        lastDate, chatRoomId, lastMessageSenderId, lastMessageMarkedAsRead } = props.chatRoom;


    const goToChatRoom = () => {
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
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 30
    }
})
