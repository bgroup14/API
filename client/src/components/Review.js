import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Rating, AirbnbRating } from 'react-native-elements';




const Review = (props) => {
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    let userId = useSelector(state => state.auth.userId);
    // const [bold, setBold] = useState(false);


    const { stars, otherMemberImage, text, otherMemberName, fromMemberId } = props.review;
    // console.log("read??: " + lastMessageMarkedAsRead)
    // setBold(false)
    // console.log("bold is set to: " + bold)

    // useFocusEffect(
    //     React.useCallback(() => {
    //         // setBold(false)
    //         // // console.log(bold)
    //         // console.log("last messenger id:" + lastMessageSenderId)
    //         // console.log("mark as read: " + lastMessageMarkedAsRead)
    //         // // if (lastMessageSenderId != userId && !lastMessageMarkedAsRead) {

    //         //     console.log("setting to bold...")
    //         //     setBold(true)
    //         // }

    //     }, [])
    // )


    // const goToChatRoom = () => {
    //     // setBold(false);
    //     props.goToOtherUserChat(chatRoomId, otherMemberName, otherMemberImage, otherMemberId, otherMemberId)
    // }


    return (
        // <TouchableOpacity onPress={() => goToOtherUserProfile()}>
        <View>

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

                <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 70 }}>

                    <View >
                        <TouchableOpacity onPress={() => props.goToOtherUserProfile(fromMemberId)}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: windowHeight / 120, flexDirection: 'row' }}>
                            <Rating readonly startingValue={stars} imageSize={20} />

                        </View>

                    </View>

                    {/* <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{otherMemberName}</Text> */}

                    <Text style={{ marginTop: windowHeight / 100, width: windowWidth / 1.6 }}>{text}</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    {/* <Rating startingValue={stars} imageSize={16} /> */}

                </View>


            </View>

            <Divider />
        </View>

    )
}

export default Review

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
