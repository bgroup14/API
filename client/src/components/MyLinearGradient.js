

import React from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const MyLinearGradient = (props) => {
    return (

        <LinearGradient

            colors={[props.firstColor, props.secondColor]}

            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: props.height
            }}

        />

    )
}


export default MyLinearGradient


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 200
    }
})