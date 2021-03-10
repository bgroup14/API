import React, { useState, Fragment } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MyLinearGradient from '../components/MyLinearGradient';
import { useSelector, useDispatch } from 'react-redux';

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Icon as MyIcon } from 'react-native-vector-icons/MaterialIcons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import PublishPostTextArea from '../components/PublishPostTextArea';

import ModalDropdown from 'react-native-modal-dropdown';

import ModalSelector from 'react-native-modal-selector'
import { CheckBox } from 'react-native';
import HorizontalLine from '../components/HorizontalLine';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FormButton from '../components/FormButton';
// import { Button } from 'react-native';
import MyOverlay from '../components/MyOverlay';
// import SearchScreen from './DatePicker';
import DatePicker from '../components/DatePicker';
import { Button } from 'react-native-elements';








//what kind of volunteering activity would you like to have
const PostPublishScreen = () => {
    let index = 0;
    const activityTypes = [
        { key: index++, section: true, label: 'Post Purpose' },
        { key: index++, label: 'Search For Help' },
        { key: index++, label: 'Give Help' },
        // { key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
        // // etc...
        // // Can also add additional custom keys which are passed to the onChange callback
        // { key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
    ];
    let indexFromWho = 0;
    const fromWho = [
        { key: indexFromWho++, section: true, label: 'Participant Gender' },
        { key: indexFromWho++, label: 'Man' },
        { key: indexFromWho++, label: 'Woman' },
        { key: indexFromWho++, label: "Dosen't Matter" },

        // { key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
        // // etc...
        // // Can also add additional custom keys which are passed to the onChange callback
        // { key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
    ];
    let indexFromAge = 0;
    const fromAge = [
        { key: indexFromAge++, section: true, label: 'Participant Age' },
        { key: indexFromAge++, label: '16-30' },
        { key: indexFromAge++, label: '30-50' },
        { key: indexFromAge++, label: '50+' },
        { key: indexFromAge++, label: "Dosen't Matter" },

        // { key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
        // // etc...
        // // Can also add additional custom keys which are passed to the onChange callback
        // { key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
    ];

    const [postContent, setPostContent] = useState();
    const [postCategory, setPostCategory] = useState();
    const [specificDate, setSpecificDate] = useState(true);
    const [haveDateFromPicker, setHaveDateFromPicker] = useState(false);
    const [dateLabel, setDateLabel] = useState();
    const [timeOFtheDay, setTimeOFtheDay] = useState();





    let userName = useSelector(state => state.auth.userName);
    const [userType, setUserType] = useState(useSelector(state => state.auth.userType));
    console.log(userType)
    const [participantGender, setParticipantGender] = useState(useSelector(state => state.auth.participantGender));
    console.log(participantGender)
    const [participantAge, setParticipantAge] = useState(useSelector(state => state.auth.participantAge));
    const [initalUserTypeValue, setInitalUserTypeValue] = useState(userType)


    ///DELETE all this if lines below!
    if (userName === null) {
        userName = 'Alan skverer'
    }
    // if (userType === null) {
    //     setUserType('Give Help')
    // }
    // if (participanteGender === null) {
    //     setParticipanteGender('Dosent Matter')
    // }
    // if (participanteAge === null) {
    //     setParticipanteAge('50+')
    // }

    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const createGreeting = () => {
        const hours = new Date().getHours(); //To get the Current Hours)
        if (hours > 0 && hours <= 5) {
            return "Good night"
        }
        else if (hours > 5 && hours <= 12) {
            return "Good morning"

        }
        else if (hours > 12 && hours <= 18) {
            return "Good afternoon"

        }
        return "Good evening"


    }
    const setUserGiveOrGetHelp = () => {
        if (userType == 'Both') {
            return "How would you like to give / get help today?"

        }
        else if (userType == 'Give Help') {
            return "How would you like to give help today?"
        }

        return "How would you like to get help today?"

    }

    let userGiveOrGet = setUserGiveOrGetHelp();
    let greeting = createGreeting();
    let items = [
        { label: 'Sport', value: 'male', icon: () => <Icon name="running" size={22} color="#000000" /> },
        { label: 'Study', value: 'female', icon: () => <Icon name="book" size={24} color="#000000" /> },
        { label: 'Mental', value: 'female', icon: () => <Icon name="phone" size={24} color="#000000" /> },
        { label: 'Elder People', value: 'female', icon: () => <Icon name="hand-holding-heart" size={24} color="#000000" /> },
        { label: 'General', value: 'female', icon: () => <Icon name="hands-helping" size={24} color="#000000" /> },
    ]

    const resetPost = () => {
        setPostContent("")
        setHaveDateFromPicker(false)

    }

    const [isVisible, setIsvisble] = useState(false);

    const receiveDateFromDatePicker = (dataObj) => {
        setIsvisble(false)
        setHaveDateFromPicker(true)
        setDateLabel(dataObj.dateLabel)
        setTimeOFtheDay(dataObj.timeOFtheDay)
    }



    return (
        <View style={styles.container}  >
            <MyOverlay isVisible={isVisible} onBackdropPress={() => setIsvisble(false)} >
                <DatePicker receiveDateFromDatePicker={(dataObj) => receiveDateFromDatePicker(dataObj)} />
            </MyOverlay>
            {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
            {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={2000} /> */}
            <MyLinearGradient firstColor="#ebf4f5" secondColor="#b5c6e0" height={2000} />


            <View style={styles.barContainer}><Text style={styles.barText}>Publish Post</Text>
                <TouchableOpacity onPress={() => resetPost()}>
                    <Text style={styles.barReset}>Reset</Text>
                </TouchableOpacity>
            </View>
            <View View style={styles.userGreetingContainer} ><Text style={styles.userGreetingText}>{greeting} {userFirstName}</Text>
                <Text style={{ padding: 10, fontSize: 16 }}>{userGiveOrGet}</Text>


                <View style={styles.selectCategoryContainer}>
                    <DropDownPicker
                        placeholder="Select Category"
                        items={items}
                        containerStyle={styles.dropDownContainer}
                        // style={{ borderWidth: 1, borderColor: '' }}
                        itemStyle={{

                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => setPostCategory(item.value)}


                    />
                </View>

            </View >
            <View style={styles.txtAreaContainer} >
                <PublishPostTextArea
                    labelValue={postContent}
                    placeholderText="What's on your mind?"
                    iconType="calendar"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => setPostContent(text)}

                />
            </View>

            <View style={styles.postOptionsContainer}>
                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Do You</Text>


                    <ModalSelector
                        data={activityTypes}

                        style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setUserType(option.label == "Search For Help" ? "Need Help" : "Give Help") }} >

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={userType == "Both" ? "Select" : userType} />
                    </ModalSelector>
                </View>

                <Divider />

                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Participant Gender</Text>

                    <ModalSelector
                        data={fromWho}
                        initValue={participantGender}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setParticipantGender(option.label) }}>

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={participantGender} />
                    </ModalSelector>

                </View>
                <Divider />

                <View style={styles.optionContainer}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Participant Age</Text>

                    <ModalSelector
                        data={fromAge}
                        initValue={participantAge}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setParticipantAge(option.label) }}>

                        <TextInput
                            textAlign="center"
                            style={styles.postBtnText}
                            editable={false}
                            value={participantAge} />

                    </ModalSelector>


                </View>

                <Divider />
                {!haveDateFromPicker ? <View style={styles.optionContainer}>

                    <Text style={{ marginTop: 10, fontSize: 16 }} >Specific Date?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginHorizontal: windowWidth / 9 }}>
                            <Button title="NO" type='solid' onPress={() => setSpecificDate(false)} buttonStyle={!specificDate ? { backgroundColor: "green" } : { fontSize: 10 }} />

                        </View>

                        <Button title="YES" type='solid' onPress={() => setIsvisble(true)} />
                    </View>


                </View> :



                    <View style={styles.optionContainer} >

                        <Text style={{ marginTop: 10, fontSize: 16 }} >Metting Date</Text>
                        <TouchableOpacity onPress={() => setIsvisble(true)}>
                            <View style={{ marginHorizontal: windowWidth / 12 }} >
                                <View >
                                    <Text>{dateLabel}
                                    </Text>
                                </View>
                                <Text>{timeOFtheDay}</Text>
                            </View>
                        </TouchableOpacity>



                    </View>




                }

                <Divider />








            </View>







            <View style={styles.btnContainer}>


                <FormButton
                    buttonTitle="Sign In!"
                // onPress={() => signIn()}
                />
            </View>

        </View >


    )

}

export default PostPublishScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // minHeight: Math.round(windowHeight + 30),

        //justifyContent: 'center',
        // alignItems: 'center',
        minHeight: Math.round(windowHeight)
    },
    barContainer: {

        // flex: 0.6,
        marginTop: windowHeight / 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        //  marginLeft: 30,
        // marginTop: 5,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 30,
        height: windowHeight / 10,





    },
    barText: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,


    },
    barReset: {
        color: 'red',
        marginTop: windowHeight / 40
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    userGreetingContainer: {
        //  flex: 1,
        // justifyContent: 'flex-start',
        alignItems: 'center',
        height: windowHeight / 6,

    },
    userGreetingText: {
        fontSize: 18,
    },
    dropDownContainer: {


        // marginTop: 5,
        //  marginBottom: 10,
        width: '98%',
        height: windowHeight / 15,

    },
    txtAreaContainer:
    {
        alignItems: 'center',
        height: windowHeight / 5,
    },

    postOptionsContainer: {
        // flex: 2.5
        height: windowHeight / 2.4,


    },
    optionContainer: {
        height: windowHeight / 13,

        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: windowHeight / 100,
        paddingHorizontal: windowWidth / 28,
        alignItems: 'center',

        // justifyContent: 'space-between'
    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    postBtnText: {

        borderWidth: 1,
        marginTop: windowHeight / 60,
        borderColor: '#ccc',
        height: windowHeight / 25,
        color: '#000000',
        fontSize: 16,
        width: windowWidth / 3.1
    },
    selectCategoryContainer:
    {
        width: '95%',
        marginLeft: windowWidth / 50
    }



})