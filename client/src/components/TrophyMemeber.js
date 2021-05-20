import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Avatar, Rating } from 'react-native-elements';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';




const TrophyMemeber = (props) => {


    const { memberName, otherMemberId, memberImage,
        userRating, reviewsCount } = props.trophyMember;

    let place = props.place;


    return (

        <View style={styles.userContainer}>
            <View style={styles.placeContainer}>
                <Text style={styles.place}>{place}) </Text>

            </View>
            <TouchableOpacity onPress={() => props.goToOtherUserProfile()}>
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
                <TouchableOpacity onPress={() => props.goToOtherUserProfile()}>
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


    )
}

export default TrophyMemeber

const styles = StyleSheet.create({

    userContainer: {
        flexDirection: 'row',
        maxHeight: windowHeight / 5,
        marginVertical: windowHeight / 50,
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
