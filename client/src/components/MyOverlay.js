
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Overlay } from 'react-native-elements';
import { windowHeight } from '../../utils/Dimentions';

const MyOverlay = (props) => {

    return (
        <Overlay isVisible={props.isVisible} onBackdropPress={props.onBackdropPress} overlayStyle={{ width: '95%', borderRadius: 15, maxHeight: windowHeight / 1.4 }}>
            {props.children}
        </Overlay>
    )
}

export default MyOverlay

const styles = StyleSheet.create({
    overlay: {

        height: '40%',
        // width: '75%',

    },

})

