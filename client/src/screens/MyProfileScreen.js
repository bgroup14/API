import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const MyProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text>MyProfile screen</Text>
        </View>
    )
}

export default MyProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
