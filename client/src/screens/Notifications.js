import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Notifications = ({ route, navigation }) => {
    const { userId, otherParam } = route.params;
    return (
        <View style={styles.container}>
            <Text>Notificaions </Text>
            <Text>{userId} </Text>
        </View>
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
