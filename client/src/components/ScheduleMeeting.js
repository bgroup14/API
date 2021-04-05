// import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Platform, Text, StyleSheet, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button } from 'react-native-elements';
import { set } from 'react-native-reanimated';
import { faChessKing } from '@fortawesome/free-solid-svg-icons';




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
            dateLabel,
            timeLabel,
            unixDate,
            eventTitle
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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.header} >Schedule Meeting</Text>
                <TextInput onChangeText={(text) => changeEventTilteHandler(text)} maxLength={30} placeholder='Enter event title' style={{


                    padding: windowWidth / 50,
                    // marginLeft: 50,
                    borderBottomColor: '#000',
                    margin: windowWidth / 10,
                    //  marginRight: 50,

                    borderBottomColor: '#000', // Add this to specify bottom border color
                    borderBottomWidth: 1,
                    fontSize: 16

                }} />

            </View>
            <View style={styles.dateContainer}>
                {dateLabel == null ? <Button buttonStyle={styles.selectDateBtn} onPress={showDatepicker} title="Select date" style={{ justifyContent: 'center' }} /> : <View><Text style={{ fontSize: 16, marginBottom: 10 }} >Selected Date: {dateLabel}</Text><Button buttonStyle={styles.selectDateBtn} title="Change Date" onPress={showDatepicker} /></View>}
                {/* <Button onPress={() => checkDate()} title="CHECK Date" /> */}
            </View>
            <View style={styles.dateContainer}>
                {timeLabel == null ? <Button buttonStyle={styles.selectDateBtn} onPress={showTimepicker} title="Select hour" /> : <View><Text style={{ fontSize: 16, marginBottom: 10 }} >Selected Hour: {timeLabel}</Text><Button buttonStyle={styles.selectDateBtn} title="Change Hour" onPress={showTimepicker} /></View>}
                {/* <Button onPress={() => checkDate()} title="CHECK Date" /> */}
            </View>

            <View>
                {/* <View style={styles.selectCategoryContainer}>
                    <DropDownPicker

                        placeholder="Time of the day"
                        items={timesOfTheDay}
                        containerStyle={styles.dropDownContainer}
                        // style={{ borderWidth: 1, borderColor: '' }}
                        itemStyle={{

                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => setTimeOFtheDay(item.value)}


                    />
                </View> */}
                {/* <Button onPress={showTimepicker} title="Choose Time" />
                <Button onPress={() => checkDate()} title="CHECK Time" /> */}

            </View>


            {/* {show ?
                <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date(2018, 1, 1)}
                    maximumDate={new Date(2099, 12, 31)}
                    //  chosenDate={date}
                    locale={"en"}
                    modalTransparent={true}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText={(new Date()).toLocaleDateString()}
                    textStyle={{ color: "grey" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onChange={onChange}
                    disabled={false}
                    value={date}
                /> : <View />} */}

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


            <View style={styles.saveBtnContainer}>
                {choseDate ? <Button type='clear' title="Send meeting invitation" onPress={() => sendDateToParent()} /> : null}
            </View>
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
        marginTop: windowHeight / 8
    },
    header: {
        fontSize: 18
    }


})
// selectCategoryContainer:

