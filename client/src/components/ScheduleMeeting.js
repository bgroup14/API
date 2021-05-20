import React, { useState } from 'react';
import { View, Platform, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button, Input, Divider } from 'react-native-elements';
import SetLocationScreen from '../screens/SetLocationScreen';
import MyOverlay from '../components/MyOverlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const ScheduleMeeting = (props) => {



    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateLabel, setDateLabel] = useState(null);
    const [timeLabel, setTimeLabel] = useState(null);
    const [unixDate, setUnixDate] = useState();
    const [choseDate, setChoseDate] = useState(false);
    const [choseHour, setChoseHour] = useState(false);
    const [eventTitle, setEventTitle] = useState(null);
    const [isVisibleLocation, setIsVisibleLocation] = useState(false);
    const [meetingLocationLabel, setMeetingLocationLabel] = useState(null);





    const setLocation = (locationObj) => {
        setMeetingLocationLabel(locationObj.locationLabel);
    }

    const showTimepicker = () => {
        showMode('time');
        setChoseHour(true)
    };

    const saveDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        setDateLabel(slicedDate)
        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);
        setShow(false)


    }


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        let slicedTime = currentDate.toString().slice(16, 21)

        setDateLabel(slicedDate)
        if (choseHour) {
            setTimeLabel(slicedTime)
        }

        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);
        setChoseDate(true)


    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('datetime');
    };


    const sendDateToParent = () => {
        if (!choseDate) {
            Alert.alert(
                "",
                "You must choose date before sending invitation",
                [
                    { text: "OK" }
                ],
            );
            return null;
        }
        let dateObj = {
            meetingDateLabel: dateLabel,
            meetingTimeLabel: timeLabel,
            meetingUnixDate: unixDate,
            meetingEventTitle: eventTitle,
            meetingLocationLabel
        }
        if (eventTitle == null) {
            Alert.alert(
                "",
                "Please enter event title",
                [
                    { text: "OK" }
                ],
            );
            return null;

        }

        props.receiveDateFromDatePicker(dateObj)
    }

    const changeEventTilteHandler = (text) => {

        setEventTitle(text);
    }



    return (
        <View >
            <View >
                <MyOverlay isVisible={isVisibleLocation} onBackdropPress={() => setIsVisibleLocation(false)}   >
                    <SetLocationScreen closeSetLocation={() => setIsVisibleLocation(false)} setLocation={(locationObj) => setLocation(locationObj)} />
                </MyOverlay>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.header} >Schedule Meeting</Text>
                </View>
                <View style={{ alignItems: 'flex-start', marginTop: windowHeight / 20 }}>
                    <Input
                        onChangeText={(text) => changeEventTilteHandler(text)}
                        placeholder='Event title'

                        containerStyle={{ width: windowWidth / 1.2 }}

                    />
                    <TouchableOpacity onPress={showDatepicker}   >
                        <Input
                            placeholder='Select date'
                            containerStyle={{ width: windowWidth / 1.1 }}
                            value={dateLabel}
                            disabled={true}

                            rightIcon={

                                <Icon
                                    name='calendar'
                                    size={24}
                                    color='black'
                                />
                            }
                            containerStyle={{ width: windowWidth / 1.2 }}

                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showTimepicker}   >
                        <Input
                            placeholder='Select time'
                            containerStyle={{ width: windowWidth / 1.1 }}
                            value={timeLabel}
                            disabled={true}

                            rightIcon={

                                <AntDesign
                                    name='clockcircleo'
                                    size={24}
                                    color='black'
                                />
                            }
                            containerStyle={{ width: windowWidth / 1.2 }}

                        />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={showTimepicker} onPress={() => setIsVisibleLocation(true)}  >
                        <Input
                            placeholder='Select location'
                            containerStyle={{ width: windowWidth / 1.1 }}
                            value={meetingLocationLabel}
                            disabled={true}
                            rightIcon={

                                <Entypo
                                    name='location'
                                    size={26}
                                    color='black'
                                />
                            }
                            containerStyle={{ width: windowWidth / 1.2 }}

                        />
                    </TouchableOpacity>

                </View>


            </View>



            {show ? <DateTimePicker
                defaultDate={new Date()}
                chosenDate={date}
                locale={"en"}
                modalTransparent={true}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText={(new Date()).toLocaleDateString()}
                textStyle={{ color: "grey" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                disabled={false}

                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                minimumDate={new Date()}
            /> : <View />}

            <Divider style={{ marginBottom: windowHeight / 100, marginTop: windowHeight / 40 }} />

            <View style={styles.saveBtnContainer}>

                <View style={{ marginLeft: 30 }}>
                    <Button type='clear' title="SEND" onPress={() => sendDateToParent()} />

                </View>
                <Button type='clear' title="CANCEL" onPress={() => props.closeMeeting()} />
            </View>

        </View>
    );
};
export default ScheduleMeeting;


const styles = StyleSheet.create({


    dropDownContainer: {

        height: windowHeight / 15,
        marginBottom: windowHeight / 100,


    },
    dateContainer: {
        marginTop: windowHeight / 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectDateBtn: {

        width: windowHeight / 4

    },
    saveBtnContainer: {
        alignItems: 'stretch',
        width: '95%',

        flexDirection: 'row-reverse',
    },
    header: {
        fontSize: 24,

        color: '#3b5998',
        marginTop: windowHeight / 50
    }


})

