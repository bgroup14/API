
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Overlay } from 'react-native-elements';
import { windowHeight, windowWidth } from '../../utils/Dimentions';

const DotsMenuOverlay = (props) => {

    return (

        <Overlay isVisible={props.isVisible} onBackdropPress={props.onBackdropPress} overlayStyle={styles.overlay}>
            {props.children}
        </Overlay>

    )
}

export default DotsMenuOverlay

const styles = StyleSheet.create({
    overlay: {
        marginBottom: windowHeight / 1.4,
        padding: windowHeight / 50,
        marginLeft: windowHeight / 5,
        borderRadius: 6,
        alignItems: 'center'

    },

})

