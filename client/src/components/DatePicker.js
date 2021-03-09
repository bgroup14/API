// import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button } from 'react-native-elements';




const DatePicker = () => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateLabel, setDateLabel] = useState(null);
    const [unixDate, setUnixDate] = useState(new Date());
    const [timeOFtheDay, setTimeOFtheDay] = useState();

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
        console.log(selectedDate)
        setShow(false)
        //saveDate(selectedDate)
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        setDateLabel(slicedDate)
        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);

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
        { label: 'Afternoon', value: 'Afternoon' },
        { label: 'Evning', value: 'Evning' },
        { label: 'Night', value: 'Night' },

    ]

    return (
        <View>

            <View style={{ marginTop: 40 }}>
                {dateLabel == null ? <Button onPress={showDatepicker} title="Click to select date" /> : <Text>Selected date: {dateLabel}</Text>}
                {/* <Button onPress={() => checkDate()} title="CHECK Date" /> */}
            </View>

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
            {show ? <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
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
                <Button type='outline' title="Save" />
            </View>
        </View>
    );
};
export default DatePicker;


const styles = StyleSheet.create({

    selectCategoryContainer:
    {
        width: '95%',
        marginLeft: windowWidth / 50
    },
    dropDownContainer: {


        // marginTop: 5,
        //  marginBottom: 10,
        width: '98%',
        height: windowHeight / 15,

    },


})
// selectCategoryContainer:

