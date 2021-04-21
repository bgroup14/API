import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
// import { Button } from 'react-native-paper';
import { Button, Input, Divider, CheckBox } from 'react-native-elements';
import axios from 'axios';





const MeetingNotApprovedScreen = (props) => {
    const { otherMemberId, otherMemberName, } = props.meetingDidntOccurObj
    const [reason, setReason] = useState();




    const submitReason = async () => {
        console.log(reason)
        if (reason == "bailed") {
            try {
                const addMeetingSkippedUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/addmeetingskipped/${otherMemberId}`
                const res = await axios.post(addMeetingSkippedUrl);
                console.log(res.data)
            } catch (error) {

            }
        }
        Alert.alert(
            "",
            "Thanks for your response",
            [
                {
                    text: "OK",
                    onPress: () => props.closeWindow(),
                },
            ],
        );

    }

    const cancelHandler = () => {
        props.closeWindow();
    }





    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.header}>What was the reason you and</Text>
                <Text style={styles.header} >{otherMemberName} didn't eventually meet?</Text>

            </View>
            <View style={styles.radioBtnContainer}>
                <CheckBox containerStyle={styles.CheckBox}
                    title={`${otherMemberName} bailed on me`}
                    checked={reason == 'bailed'}
                    onPress={() => setReason("bailed")}

                />
                <CheckBox containerStyle={styles.CheckBox}
                    title='We cancelled beforehand'
                    checked={reason == 'cancelled'}
                    onPress={() => setReason("cancelled")}

                />
                <CheckBox containerStyle={styles.CheckBox}

                    checked={reason == 'rescheduled'}
                    title='We rescheduled to another date'
                    onPress={() => setReason("rescheduled")}
                />
                <CheckBox containerStyle={styles.CheckBox}

                    title="We didn't plan to meet"
                    checked={reason == 'noPlan'}
                    onPress={() => setReason("noPlan")}
                />
            </View>
            <Divider />
            <View style={styles.saveBtnContainer}>

                <View style={{ marginLeft: 30 }}>
                    <Button type='clear' title="SUBMIT" onPress={() => submitReason()} />

                </View>
                <View style={{ marginLeft: 30 }}>
                    <Button type='clear' title="CANCEL" onPress={() => cancelHandler()} />

                </View>
            </View>
            {/* <Button style={{ backgroundColor: '#3b5998', width: windowWidth / 2 }} uppercase={false} mode="contained" onPress={() => console.log('Pressed')}>
                Submit
  </Button> */}
        </View>
    )
}

export default MeetingNotApprovedScreen

const styles = StyleSheet.create({
    header: {
        fontSize: 18
    },
    dropDownContainer: {

        // marginTop: 5,
        //  marginBottom: 10,
        width: windowWidth * 0.82,
        height: windowHeight / 15,
        // marginTop: windowHeight / 100,
        marginBottom: windowHeight / 100,


    },
    optionsContainer: {
        marginBottom: windowHeight / 5,
        marginTop: windowHeight / 40
    },
    saveBtnContainer: {
        // marginTop: windowHeight / 30,
        alignItems: 'stretch',
        // marginRight: windowWidth / 10,
        // flexDirection: 'row-reverse',
        // // justifyContent: 'flex-start',
        // // marginTop: windowHeight / 40,

        // // marginRight: 50,
        width: '95%',

        flexDirection: 'row-reverse',
    },
    radioBtnContainer: {

        marginVertical: windowHeight / 50,
        justifyContent: 'space-around'
        // width: '100%',
    },
    CheckBox:
    {
        borderWidth: 0,
        backgroundColor: 'transparent'
    },
})
