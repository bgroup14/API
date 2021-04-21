// import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { View, Platform, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button, Input, Divider } from 'react-native-elements';
import { set } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';





const DatePicker = (props) => {



    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateLabel, setDateLabel] = useState(null);
    const [unixDate, setUnixDate] = useState();
    const [timeOFtheDay, setTimeOFtheDay] = useState();
    const [choseDate, setChoseDate] = useState(false);

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


        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');


        setDate(currentDate);

        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        setDateLabel(slicedDate)
        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);
        console.log("unix is: " + unixDateToSend)
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
        showMode('date');
    };

    // const showTimepicker = () => {
    //     showMode('time');
    // };
    const checkDate = () => {
        console.log(date)
        console.log(unixDate)
        // console.log(time)
    };

    let timesOfTheDay = [
        { label: 'Morning', value: 'Morning' },
        { label: 'Noon', value: 'Noon' },
        { label: 'Afternoon', value: 'Afternoon' },
        { label: 'Evning', value: 'Evning' },
        { label: 'All Day', value: 'All Day' },

    ]
    const sendDateToParent = () => {
        if (!choseDate) {
            Alert.alert(
                "",
                "You must choose date before saving",
                [
                    { text: "OK" }
                ],
            );
            return null;
        }
        let dateObj = {
            dateLabel,
            timeOFtheDay,
            unixDate
        }
        console.log(unixDate)
        // console.log(data.dateLabel)
        // console.log(data.timeOFtheDay)
        // props.getDatePickerData()
        props.receiveDateFromDatePicker(dateObj)
    }



    return (
        <View >

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.header} >Meeting Date</Text>
            </View>

            <TouchableOpacity onPress={showDatepicker} style={{ marginTop: windowHeight / 40 }}   >
                <Input
                    placeholder='Select date'
                    // containerStyle={{ marginTop: 100 }}
                    value={dateLabel}
                    disabled={true}
                    // style={{ minWidth: windowWidth / 1.3 }}
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

            <View>
                <View style={styles.selectCategoryContainer}>
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
                </View>
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
                //display='spinner'
                onChange={onChange}
                minimumDate={new Date()}
            /> : <View />}
            {/* {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                />
            )} */}

            <View>
                <Divider style={{ marginBottom: windowHeight / 100 }} />

                <View style={styles.saveBtnContainer}>

                    <View style={{ marginLeft: 30 }}>
                        <Button type='clear' title="SAVE" onPress={() => sendDateToParent()} />

                    </View>
                    <Button type='clear' title="CANCEL" onPress={() => props.closeDatePicker()} />
                </View>


            </View>

        </View>
    );
};
export default DatePicker;


const styles = StyleSheet.create({

    selectCategoryContainer:
    {
        //width: '95%',
        //marginLeft: windowWidth / 50
        marginBottom: windowHeight / 10
    },
    dropDownContainer: {

        // marginTop: 5,
        //  marginBottom: 10,
        width: windowWidth * 0.82,
        height: windowHeight / 15,
        // marginTop: windowHeight / 100,
        marginBottom: windowHeight / 100,


    },
    dateContainer: {
        //marginTop: windowHeight / 40,
        marginBottom: windowHeight / 40,
    },
    selectDateBtn: {
        // width: '95%',
    },
    saveBtnContainer: {
        // flexDirection: 'row',
        // marginTop: windowHeight / 8,
        // justifyContent: 'space-evenly',
        alignItems: 'stretch',
        // marginRight: windowWidth / 10,
        // flexDirection: 'row-reverse',
        // // justifyContent: 'flex-start',
        // // marginTop: windowHeight / 40,

        // // marginRight: 50,
        width: '95%',

        flexDirection: 'row-reverse',
        // justifyContent: 'flex-start',
        // marginTop: windowHeight / 40,

        // marginRight: 50,
        // width: '90%',
        // padding: windowHeight / 100,
        // height: windowHeight / 10
        // alignItems: 'flex-start'

    },
    header: {
        fontSize: 24,
        color: '#3b5998'

    }


})
// selectCategoryContainer:

