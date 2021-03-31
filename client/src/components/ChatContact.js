import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight } from '../../utils/Dimentions';


const ChatContact = (props) => {
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    const { otherMemberName, otherMemberId, otherMemberImage, latstSentence, lastDate, chatRoomId } = props.chatRoom;
    // console.log("user derails are: " + otherMemberName)

    const goToChatRoom = () => {
        props.goToOtherUserChat(chatRoomId)
    }
    return (
        <TouchableOpacity onPress={() => goToChatRoom()}>

            <View style={styles.userContainer}>

                <Avatar

                    size='large'
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            otherMemberImage,
                    }}
                />
                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 80 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                    <Text style={{ marginTop: windowHeight / 100, fontStyle: 'italic' }}>{latstSentence}</Text>


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
