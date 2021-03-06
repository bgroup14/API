

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const MyLinearGradient = (props) => {
    return (

        <LinearGradient
            // Background Linear Gradient
            // colors={['#93C6F9', '#97B4FA', '#A768FE']}
            //  colors={['#a1c4fd', '#c2e9fb']} // //
            colors={[props.firstColor, props.secondColor]} // //
            //  start={[0, 0]}
            //   end={[1, 1]}
            //    location={[0.25, 0.4, 1]}
            // colors={['rgba(0,0,0,0.8)', 'transparent']}
            //style={{ flex: 1, height: '50%' }}
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
        //  justifyContent: 'center',
        // alignItems: 'center'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        //height: props.height
        height: 200
    }
})