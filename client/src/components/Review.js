import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Divider from 'react-native-btr/src/Components/Separator';
import { Avatar } from 'react-native-elements';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import { Rating } from 'react-native-elements';




const Review = (props) => {
    let userId = useSelector(state => state.auth.userId);
    const { stars, otherMemberImage, text, otherMemberName, fromMemberId } = props.review;



    return (
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


                    <Text style={{ marginTop: windowHeight / 100, width: windowWidth / 1.6 }}>{text}</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
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
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 30
    }
})
