import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Appbar, Badge } from 'react-native-paper';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import TrophyMemeber from '../components/TrophyMemeber';




const TrophyScreen = (props) => {

    const [filter, setFilter] = useState('allTime');

    const filterHanlder = (time) => {
        setFilter(time);

    }

    let temp = {
        memberImage: 'data:image/jpeg;base64,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',
        memberName: 'Alan Skverer',
        userRating: 4.3,
        reviewsCount: 29,
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#3b5998' }} >
                <Appbar.BackAction onPress={() => props.navigation.navigate('Home')} />
                <Appbar.Content title="Top Rated Users" />
            </Appbar.Header>
            <View style={styles.buttonContainer}>
                <Button labelStyle={filter == "allTime" ? { color: '#fff' } : { color: 'black' }}
                    style={filter == "allTime" ? { flex: 1, backgroundColor: 'blue' } : { flex: 1 }} mode='outlined'
                    onPress={() => filterHanlder('allTime')}>
                    All Time
                    </Button>

                <Button labelStyle={filter == "thisMonth" ? { color: '#fff' } : { color: 'black' }}
                    style={filter == "thisMonth" ? { flex: 1, backgroundColor: 'blue' } : { flex: 1 }} mode="outlined"
                    onPress={() => filterHanlder('thisMonth')}>
                    This Month
                      </Button>
            </View>
            <View style={styles.inner}>
                <TrophyMemeber trophyMember={temp} place={1} />
                <TrophyMemeber trophyMember={temp} place={2} />


            </View>


        </View>
    )
}

export default TrophyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: windowHeight / 200
    },
    inner: {
        // backgroundColor: 'red',
        // height: 200
    }
})
