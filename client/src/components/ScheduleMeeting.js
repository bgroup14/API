// import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Platform, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button, Input, Divider } from 'react-native-elements';
import { set } from 'react-native-reanimated';
import { faChessKing } from '@fortawesome/free-solid-svg-icons';
import SetLocationScreen from '../screens/SetLocationScreen';
import MyOverlay from '../components/MyOverlay';

import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAvoidingView } from 'react-native';






const ScheduleMeeting = (props) => {



    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateLabel, setDateLabel] = useState(null);
    const [timeLabel, setTimeLabel] = useState(null);
    const [unixDate, setUnixDate] = useState();
    const [timeOFtheDay, setTimeOFtheDay] = useState();
    const [choseDate, setChoseDate] = useState(false);
    const [choseHour, setChoseHour] = useState(false);
    const [eventTitle, setEventTitle] = useState(null);
    const [isVisibleLocation, setIsVisibleLocation] = useState(false);
    const [meetingLocationLabel, setMeetingLocationLabel] = useState(null);





    const setLocation = (locationObj) => {
        console.log(locationObj)
        // console.log(locationObj.)
        setMeetingLocationLabel(locationObj.locationLabel);
        // if (locationObj.latitude != undefined) {
        //     setPostLatitude(locationObj.latitude);
        //     setPostLongitude(locationObj.longitude);
        // }
        // else {
        //     setPostLatitude(null);
        //     setPostLongitude(null);

        // }



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
        //        setShow(Platform.OS === 'ios');


    }


    const onChange = (event, selectedDate) => {
        //  setShow(false)
        console.log("selected time is:?? " + selectedDate)
        // return null


        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');


        setDate(currentDate);

        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        let slicedTime = currentDate.toString().slice(16, 21)

        console.log(currentDate)
        console.log(slicedTime)
        setDateLabel(slicedDate)
        if (choseHour) {
            setTimeLabel(slicedTime)
        }

        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);
        // console.log("unix is: " + unixDateToSend)
        setChoseDate(true)

        // setShow(Platform.OS === 'ios');








        // console.log(Platform.OS)


        // const currentDate = selectedDate || date;


        // setShow(false);


        // try {
        //     unShow();

        // } catch (error) {
        //     console.log(error)

        // }
        // console.log(selectedDate)
        // console.log(Platform.OS)


        //saveDate(selectedDate)


        // setShow(!show)
        //        setShow(Platform.OS === 'ios');






        // const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'ios');
        // setDate(currentDate);
        // // setDateLabel("Date Selected")
        // let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        // setDateLabel(slicedDate)
        // let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        // setUnixDate(unixDateToSend)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('datetime');
    };

    // const showTimepicker = () => {
    //     showMode('time');
    // };
    const checkDate = () => {
        console.log(date)
        console.log(unixDate)
        // console.log(time)
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
        // console.log(dateObj)
        // console.log(data.dateLabel)
        // console.log(data.timeOFtheDay)
        // props.getDatePickerData()
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
                <Text style={styles.header} >Schedule Meeting</Text>

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
                            // disabledInputStyle={{ color: '#000000' }}

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
                            // disabledInputStyle={{ color: '#000000' }}

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
                // display='spinner'
                onChange={onChange}
                minimumDate={new Date()}
            /> : <View />}

            <Divider style={{ marginBottom: windowHeight / 100, marginTop: windowHeight / 40 }} />

            <View style={styles.saveBtnContainer}>

                <View style={{ marginLeft: 30 }}>
                    <Button type='clear' title="SEND" onPress={() => sendDateToParent()} />

                </View>
                <Button type='clear' title="CANCEL" onPress={() => props.closeDatePicker()} />
            </View>
            {/* <View style={styles.saveBtnContainer}>
                {choseDate ? <Button type='clear' title="Send meeting invitation" onPress={() => sendDateToParent()} /> : null}
            </View> */}
        </View>
    );
};
export default ScheduleMeeting;


const styles = StyleSheet.create({

    selectCategoryContainer:
    {
        //width: '95%',
        //marginLeft: windowWidth / 50
    },
    dropDownContainer: {

        // marginTop: 5,
        //  marginBottom: 10,
        //width: '98%',
        height: windowHeight / 15,
        // marginTop: windowHeight / 100,
        marginBottom: windowHeight / 100,


    },
    dateContainer: {
        marginTop: windowHeight / 40,
        justifyContent: 'center',
        // marginBottom: windowHeight / 40,
        alignItems: 'center'
    },
    selectDateBtn: {
        // width: '50%',
        // display: 'flex'
        // margin: 20,
        // marginHorizontal: 50
        width: windowHeight / 4

    },
    saveBtnContainer: {
        // marginTop: windowHeight / 30,
        alignItems: 'stretch',
        // marginRight: windowWidth / 10,
        // flexDirection: 'row-reverse',
        // // justifyContent: 'flex-start',
        // // marginTop: windowHeight / 40,

        // // marginRight: 50,
        width: '95%',

        flexDirection: 'row-reverse',
    },
    header: {
        fontSize: 18,
        marginTop: windowHeight / 50
    }


})
// selectCategoryContainer:

