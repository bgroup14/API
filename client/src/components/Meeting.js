import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';




const Meeting = (props) => {

    let userId = useSelector(state => state.auth.userId);
    const { otherMemberName, otherMemberId, otherMemberImage, meetingEventTitle,
        meetingLocationLabel, meetingDateLabel, meetingTimeLabel } = props.meeting;




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


                </View>




            </View>
            <View  >

            </View>

            <View style={{ height: windowHeight / 100, backgroundColor: '#f2f2f2' }}>

            </View>
        </View>

    )
}

export default Meeting

const styles = StyleSheet.create({

    userContainer: {
        flexDirection: 'row',
        maxHeight: windowHeight / 10,
        marginVertical: windowHeight / 70,
        marginBottom: windowHeight / 20,
    }
})
