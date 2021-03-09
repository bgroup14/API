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






const PostPublishScreen = () => {
    let index = 0;
    const activityTypes = [
        { key: index++, section: true, label: 'Post Purpose' },
        { key: index++, label: 'Search For Help' },
        { key: index++, label: 'Give Help' },
    ];

    let indexFromWho = 0;
    const fromWho = [
        { key: indexFromWho++, section: true, label: 'Participant Gender' },
        { key: indexFromWho++, label: 'Dosent Matter' },
        { key: indexFromWho++, label: 'Man' },
        { key: indexFromWho++, label: 'Woman' },

    ];

    const [postContent, setPostContent] = useState();
    const [postCategory, setPostCategory] = useState();





    let userName = useSelector(state => state.auth.userName);
    let userType = useSelector(state => state.auth.userType);

    ///DELETE THIS 4 lines below!
    if (userName === null) {
        userName = 'Alan skverer'
    }
    if (userType === null) {
        userType = 'Give Help'
    }
    const [userPostType, setUserPostType] = useState(userType);
    const [userPostGender, setUserPostGender] = useState("Dosen't Matter");

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

        } else if (userType == 'Give Help') {
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

    }
    return (



        <View style={styles.container}  >
            <KeyboardAvoidingView
                behavior='position'
                keyboardVerticalOffset={30}
            ></KeyboardAvoidingView>

            {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
            <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={2000} />


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
            <View style={{ alignItems: 'center' }} >
                <PublishPostTextArea
                    labelValue={postContent}
                    placeholderText="What's on your mind?"
                    iconType="calendar"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => setPostContent(text)}

                />
            </View>
            <View style={{ flex: 0.2 }}></View>
            <View style={{ flex: 2.5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 30 }}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Do You</Text>
                    {/* <ModalSelector
                            data={activityTypes}
                            initValue="Select something yummy!"
                            onChange={(option) => { alert(`${option.label}`) }} /> */}
                    <ModalSelector
                        data={activityTypes}
                        initValue={userPostType}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setUserPostType(option.label == "Search For Help" ? "Need Help" : "Give Help") }}
                    // /style={{ marginLeft: 40 }}
                    >


                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#ccc', height: 40, color: 'black', padding: 10, fontSize: 16 }}
                            editable={false}
                            // placeholder="Select something yummy!"
                            value={userPostType} />

                    </ModalSelector>



                    {/* <ModalDropdown style={{ alignItems: 'flex-end' }} onSelect={(value => alert(value))}
                            defaultValue={userType} options={['Need Help', 'Give Help']}
                            dropdownStyle={{ height: 80, width: 80 }}
                            textStyle={{ fontSize: 14 }} /> */}

                </View>
                {/* <HorizontalLine /> */}
                <Divider />
















                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, paddingHorizontal: 30 }}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Participant Gender</Text>
                    {/* <ModalSelector
                            data={activityTypes}
                            initValue="Select something yummy!"
                            onChange={(option) => { alert(`${option.label}`) }} /> */}
                    <ModalSelector
                        data={fromWho}
                        initValue={userPostGender}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setUserPostType(option.label == "Search For Help" ? "Need Help" : "Give Help") }}
                    // /style={{ marginLeft: 40 }}
                    >


                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#ccc', height: 40, color: 'black', padding: 10, fontSize: 16 }}
                            editable={false}
                            // placeholder="Select something yummy!"
                            value={userPostGender} />

                    </ModalSelector>



                    {/* <ModalDropdown style={{ alignItems: 'flex-end' }} onSelect={(value => alert(value))}
                            defaultValue={userType} options={['Need Help', 'Give Help']}
                            dropdownStyle={{ height: 80, width: 80 }}
                            textStyle={{ fontSize: 14 }} /> */}

                </View>
                {/* <HorizontalLine /> */}
                <Divider />










                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, paddingHorizontal: 30 }}>
                    <Text style={{ marginTop: 10, fontSize: 16 }} >Participant Gender</Text>
                    {/* <ModalSelector
                            data={activityTypes}
                            initValue="Select something yummy!"
                            onChange={(option) => { alert(`${option.label}`) }} /> */}
                    <ModalSelector
                        data={fromWho}
                        initValue={userPostGender}
                        supportedOrientations={['landscape']}
                        accessible={true}
                        scrollViewAccessibilityLabel={'Scrollable options'}
                        cancelButtonAccessibilityLabel={'Cancel Button'}
                        onChange={(option) => { setUserPostType(option.label == "Search For Help" ? "Need Help" : "Give Help") }}
                    // /style={{ marginLeft: 40 }}
                    >


                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#ccc', height: 40, color: 'black', padding: 10, fontSize: 16 }}
                            editable={false}
                            // placeholder="Select something yummy!"
                            value={userPostGender} />

                    </ModalSelector>



                    {/* <ModalDropdown style={{ alignItems: 'flex-end' }} onSelect={(value => alert(value))}
                            defaultValue={userType} options={['Need Help', 'Give Help']}
                            dropdownStyle={{ height: 80, width: 80 }}
                            textStyle={{ fontSize: 14 }} /> */}

                </View>
                {/* <HorizontalLine /> */}
                <Divider />













                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text></Text>
                </View>

                {/* <View style={{ alignItems: 'flex-end' }}>

                    </View> */}



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

        flex: 0.6,

        justifyContent: 'space-between',
        alignItems: 'center',
        //  marginLeft: 30,
        // marginTop: 5,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 30,





    },
    barText: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20

    },
    barReset: {
        color: 'red',
        marginTop: 20
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    userGreetingContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
        alignItems: 'center'

    },
    userGreetingText: {
        fontSize: 18,
    }, dropDownContainer: {

        marginTop: 5,
        marginBottom: 10,
        width: '98%',
        height: windowHeight / 15,

    },
    selectCategoryContainer: { width: '95%', marginLeft: 10 }


})