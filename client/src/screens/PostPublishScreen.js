import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const PostPublishScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Post publish screen</Text>
        </View>
    )
}

export default PostPublishScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
