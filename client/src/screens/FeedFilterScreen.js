import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../utils/Dimentions';

import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';





const FeedFilterScreen = (props) => {


    const [sortBy, setSortBy] = useState('Relevance');
    const [userType, setUserType] = useState(useSelector(state => state.user.userType));
    const [meetingLocation, setMeetingLocation] = useState(useSelector(state => state.user.meetingLocation));
    const [participantGender, setParticipantGender] = useState(useSelector(state => state.user.participantGender))
    const [participantAge, setParticipantAge] = useState(useSelector(state => state.user.participantAge));




    let sortByOptions = [
        { label: 'Relevance', value: 'Relevance', },
        { label: 'Meeting location', value: 'Location', },
        { label: 'Meeting date', value: 'Date', },
    ]
    let userTypeOptions = [
        { label: 'Need help', value: 'Need Help', },
        { label: 'Give help', value: 'Give Help', },
        { label: 'Both', value: 'Both', },
    ]
    let meetingLocationOptions = [
        { label: 'My area', value: 'My Area', },
        { label: '30KM', value: '30KM', },
        { label: 'All country', value: 'All Country', },
        { label: 'Zoom only', value: 'Zoom Only', },
    ]
    let genderOptions = [
        { label: 'Man', value: 'Man', },
        { label: 'Woman', value: 'Woman', },
        { label: "Dosen't Matter", value: "Dosen't Matter", },

    ]
    let ageOptions = [
        { label: '16-30', value: 'My Area', },
        { label: '30-50', value: '30-50', },
        { label: '50+', value: '50+', },
        { label: "Dosen't Matter", value: "Dosen't Matter", },
    ]

    const sendFilteredObj = () => {
        let filteredObj = {
            sortBy,
            userType,
            meetingLocation,
            participantGender,
            participantAge
        }
        props.sendFilteredObj(filteredObj)

    }





    return (
        <View style={{ height: windowHeight / 1.8 }} >
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Posts filter</Text>
            </View>
            <View style={styles.filterOptionsContainer}>
                <View style={styles.filterText}>
                    <Text>Sort by</Text>
                </View>
                <DropDownPicker
                    placeholder="Relevance"
                    items={sortByOptions}
                    style={{ borderWidth: 0 }}
                    containerStyle={styles.dropDownContainer}
                    itemStyle={{

                        justifyContent: 'flex-start', marginTop: 1, paddingBottom: 15
                    }}
                    onChangeItem={item => setSortBy(item.value)}
                // onChangeItem={item => setPostCategory(item.value)}
                />

            </View>
            <View style={styles.filterOptionsContainer}>
                <View style={styles.filterText}>
                    <Text>Do you</Text>
                </View>
                <DropDownPicker
                    placeholder={userType}
                    items={userTypeOptions}
                    style={{ borderWidth: 0 }}
                    containerStyle={styles.dropDownContainer}
                    itemStyle={{

                        fontSize: 40,
                        justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 10
                    }}
                    onChangeItem={item => setUserType(item.value)}
                // onChangeItem={item => setPostCategory(item.value)}
                />

            </View>
            <View style={styles.filterOptionsContainer}>
                <View style={styles.filterText}>
                    <Text>Location</Text>
                </View>
                <DropDownPicker
                    placeholder={meetingLocation}
                    items={meetingLocationOptions}
                    style={{ borderWidth: 0 }}
                    containerStyle={styles.dropDownContainer}
                    itemStyle={{

                        justifyContent: 'flex-start', marginTop: 1, paddingBottom: 8
                    }}
                    onChangeItem={item => setMeetingLocation(item.value)}
                // onChangeItem={item => setPostCategory(item.value)}
                />

            </View>
            <View style={styles.filterOptionsContainer}>
                <View style={styles.filterText}>
                    <Text>Age</Text>
                </View>
                <DropDownPicker
                    placeholder={participantAge}
                    items={ageOptions}
                    style={{ borderWidth: 0 }}
                    containerStyle={styles.dropDownContainer}
                    itemStyle={{

                        fontSize: 40,
                        justifyContent: 'flex-start', marginTop: 1, paddingBottom: 8
                    }}
                    onChangeItem={item => setParticipantAge(item.value)}
                // onChangeItem={item => setPostCategory(item.value)}
                />

            </View>
            <View style={{ marginBottom: 40 }}>
                <View style={styles.filterOptionsContainer}>
                    <View style={styles.filterText}>
                        <Text>Gender</Text>
                    </View>
                    <DropDownPicker
                        placeholder={participantGender}
                        items={genderOptions}
                        style={{ borderWidth: 0 }}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{

                            fontSize: 40,
                            justifyContent: 'flex-start', marginTop: 1, paddingBottom: 10
                        }}
                        onChangeItem={item => setParticipantGender(item.value)}
                    // onChangeItem={item => setPostCategory(item.value)}
                    />

                </View>
            </View>


            <Divider />
            <View style={styles.btnContainer}>
                <Button title="Apply" type='clear' onPress={() => sendFilteredObj()} />
                <Button title="Cancel" type='clear' buttonStyle={{ marginRight: windowWidth / 20 }} onPress={() => props.closeFilter()} />

            </View>

        </View>
    )
}

export default FeedFilterScreen

const styles = StyleSheet.create({

    headerContainer: {
        margin: windowHeight / 50
    },
    header: {
        fontSize: 24
    },
    filterOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: windowWidth / 15,



    },
    dropDownContainer: {

        width: '45%',
        height: windowHeight / 15,

    },
    filterText: {
        marginTop: windowHeight / 48,
        maxWidth: windowWidth / 7
    },
    btnContainer: {
        flexDirection: 'row-reverse',
        // justifyContent: 'flex-start',
        marginTop: windowHeight / 40,

        // marginRight: 50,
        width: '90%',
        // padding: windowHeight / 100,
        // height: windowHeight / 10
        // alignItems: 'flex-start'

    },



})