import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const MeetingNotApprovedScreen = (props) => {
    const { otherMemberId, otherMemberName, } = props.meetingDidntOccurObj

    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.header}>What was the reason you and</Text>
                <Text>{otherMemberName} didn't eventually meet?</Text>
            </View>
            <Text>{otherMemberId}</Text>
            <Text>{otherMemberId}</Text>
            <Text>{otherMemberId}</Text>
            <Text>{otherMemberId}</Text>
            <Text>{otherMemberId}</Text>
            <Text>{otherMemberName}</Text>
        </View>
    )
}

export default MeetingNotApprovedScreen

const styles = StyleSheet.create({
    header: {
        fontSize: 20
    }
})
