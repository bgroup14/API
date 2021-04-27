import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar, Rating } from 'react-native-elements';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';




const TrophyMemeber = (props) => {
    // const { fullName, memberId, pictureUrl, chatSentence, chatDate } = props.user;
    let userId = useSelector(state => state.auth.userId);
    // const [bold, setBold] = useState(false);


    const { memberName, otherMemberId, memberImage,
        userRating, reviewsCount } = props.trophyMember;

    let place = props.place;
    // console.log("read??: " + lastMessageMarkedAsRead)
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


    const goToOtherUserProfile = () => {
        alert(1)
        // props.goToOtherUserChat(chatRoomId, memberName, memberImage, otherMemberId, otherMemberId)
    }


    return (

        <View style={styles.userContainer}>
            <View style={styles.placeContainer}>
                <Text style={styles.place}>{place}) </Text>

            </View>
            <TouchableOpacity onPress={() => goToOtherUserProfile()}>
                <Avatar

                    size='medium'
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            memberImage,
                    }}
                />
            </TouchableOpacity>

            <View style={{ marginTop: windowHeight / 100, marginLeft: windowHeight / 80 }}>
                <TouchableOpacity onPress={() => goToOtherUserProfile()}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: windowWidth / 60 }}>{memberName}</Text>
                </TouchableOpacity>
                <View style={styles.ratingContainer} >
                    <Rating readonly fractions={2} startingValue={userRating} imageSize={24} />
                    <View style={{ marginTop: windowHeight / 200, width: windowWidth / 1.2 }}>
                        <Text>{userRating} Stars - {reviewsCount} Reviews</Text>
                    </View>
                </View>


            </View>





        </View>

        // <Divider />

    )
}

export default TrophyMemeber

const styles = StyleSheet.create({

    userContainer: {
        // flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        maxHeight: windowHeight / 5,
        marginVertical: windowHeight / 50,
        // backgroundColor: 'red'
    },
    ratingContainer: {
        alignItems: 'flex-start',
        marginRight: windowWidth,
        justifyContent: 'flex-start',
        marginVertical: windowHeight / 200
    },
    placeContainer: {
        marginTop: windowHeight / 50,
        marginLeft: 10
    },
    place: {
        fontSize: 24
    }
})
