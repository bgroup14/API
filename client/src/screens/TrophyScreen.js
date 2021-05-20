import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Appbar } from 'react-native-paper';
import { Button } from 'react-native-paper';
import TrophyMemeber from '../components/TrophyMemeber';
import axios from 'axios';


const TrophyScreen = (props) => {

    const [filter, setFilter] = useState('allTime');
    const [trophiesList, setTrophiesList] = useState([]);
    const fecthTrophiesUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/gettrophymembers/${filter}`
    //https://proj.ruppin.ac.il/bgroup14/prod/api/member/gettrophymembers/allTime

    useEffect(() => {


        fecthTrophies();

    }, [filter])

    const fecthTrophies = async () => {
        const res = await axios.get(fecthTrophiesUrl);
        setTrophiesList(res.data)
    }

    const filterHanlder = (time) => {
        setFilter(time);

    }

    const goToOtherUserProfile = (member) => {

        props.navigation.navigate('OtherUserProfileScreen', {
            userId: member.otherMemberId
        })
    }


    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#3b5998' }} >
                <Appbar.BackAction onPress={() => props.navigation.navigate('Home')} />
                <Appbar.Content title="Top Rated Users" />
            </Appbar.Header>
            <View style={styles.buttonContainer}>
                <Button labelStyle={filter == "allTime" ? { color: '#fff' } : { color: 'black' }}
                    style={filter == "allTime" ? { flex: 1, backgroundColor: 'blue' } : { flex: 1 }} mode='text'
                    onPress={() => filterHanlder('allTime')}>
                    All Time
                    </Button>

                <Button labelStyle={filter == "lastMonth" ? { color: '#fff' } : { color: 'black' }}
                    style={filter == "lastMonth" ? { flex: 1, backgroundColor: 'blue' } : { flex: 1 }} mode="outlined"
                    onPress={() => filterHanlder('lastMonth')}>
                    Last Month
                      </Button>
            </View>
            <ScrollView style={styles.inner}>
                {trophiesList.map((member, index) => {
                    return <TrophyMemeber key={index} trophyMember={member} place={index + 1} goToOtherUserProfile={() => goToOtherUserProfile(member)} />

                })}
            </ScrollView>


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

    },
    inner: {
        // backgroundColor: 'red',
        // height: 200
    }
})
