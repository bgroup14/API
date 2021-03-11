
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Overlay } from 'react-native-elements';

const MyOverlay = (props) => {
    return (
        <Overlay isVisible={props.isVisible} onBackdropPress={props.onBackdropPress} overlayStyle={styles.overlay}>
            {props.children}
        </Overlay>
    )
}

export default MyOverlay

const styles = StyleSheet.create({
    overlay: {
        height: '40%',
        width: '75%',

    },

})

