import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header( {title} ) {
    return (
        <View styles={styles.header} >
            <Text style={styles.headerText}>{title}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        // fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
        letterSpacing: 1,
        textAlign: 'center'
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 5,
        height: '100%',
        width: '100%',
    },
})