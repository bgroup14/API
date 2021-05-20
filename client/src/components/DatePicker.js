import React, { useState } from 'react';
import { View, Platform, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Button, Input, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';





const DatePicker = (props) => {



    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateLabel, setDateLabel] = useState(null);
    const [unixDate, setUnixDate] = useState();
    const [timeOFtheDay, setTimeOFtheDay] = useState();
    const [choseDate, setChoseDate] = useState(false);




    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
        setDateLabel(slicedDate)
        let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
        setUnixDate(unixDateToSend);
        setChoseDate(true)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
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

            <View>
                <View style={styles.selectCategoryContainer}>
                    <DropDownPicker

                        placeholder="Time of the day"
                        items={timesOfTheDay}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{

                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => setTimeOFtheDay(item.value)}


                    />
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

        marginBottom: windowHeight / 10
    },
    dropDownContainer: {

        width: windowWidth * 0.82,
        height: windowHeight / 15,
        marginBottom: windowHeight / 100,


    },
    dateContainer: {
        marginBottom: windowHeight / 40,
    },
    selectDateBtn: {
    },
    saveBtnContainer: {

        alignItems: 'stretch',
        width: '95%',
        flexDirection: 'row-reverse',

    },
    header: {
        fontSize: 24,
        color: '#3b5998'

    }


})

