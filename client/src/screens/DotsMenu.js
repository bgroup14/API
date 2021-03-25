import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { windowHeight } from '../../utils/Dimentions'

const DotsMenu = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => props.editProfile()}>
                <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.editFeedSettings()}>
                <Text style={styles.optionText}>Feed Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.optionText}>Get Certification</Text>
            </TouchableOpacity>
        </View>

    )
}

export default DotsMenu

const styles = StyleSheet.create({

    container: {
        alignItems: 'center'

    },
    optionText: {
        fontSize: 16,
        marginBottom: windowHeight / 50
    }
})
