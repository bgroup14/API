import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Button } from 'react-native-elements';

import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MyOverlay from '../components/MyOverlay';







import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Divider } from 'react-native-elements';
import axios from 'axios';
import { Avatar } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';




import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FeedFilterScreen from './FeedFilterScreen';
import CommentsScreens from './CommentsScreens';
import MessageBubble from '../components/MessageBubble';
// import MessageBubble from;






const ChatWithOtherUser = (props) => {

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        scrollView.current.scrollToEnd()

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, [keyboardStatus]);

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
    const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");




    const { route, navigation } = props
    const scrollView = useRef()
    const [keyboadrdOpen, setKeyboadOpen] = useState(false);





    useFocusEffect(
        React.useCallback(() => {

            scrollView.current.scrollToEnd()


        }, [keyboardStatus])
    )
    useEffect(() => {
    }, [])


    /* 2. Get the param */
    const { chatRoomId, otherMemberName, otherMemberImage } = route.params;

    const [posts, setPosts] = useState([]);
    const userId = useSelector(state => state.auth.userId);



    //goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}

    return (
        <KeyboardAvoidingView style={styles.container}>

            <View style={styles.inner}>
                <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
                {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={80} /> */}
                <View >
                    <View style={styles.barContainer} >

                        <Avatar
                            size='small'
                            // avatarStyle={{ height: 59, }}
                            // containerStyle={{ marginTop: 10 }}
                            rounded
                            source={{
                                uri:
                                    otherMemberImage
                                // postCreatorImg,
                            }}
                        />
                        <Text style={styles.barText}>{otherMemberName}</Text>
                        <View style={styles.IconContainer}>
                            <Icon
                                style={styles.bellIcon}
                                name='calendar'
                                onPress={() => props.navigation.navigate('Notifications')}
                            />
                        </View>
                    </View>

                </View>


                <ScrollView style={{ marginTop: 20 }} ref={scrollView}>
                    <MessageBubble mine={false} text='You want to meetup ?' />
                    <MessageBubble mine={true} text='Yes for sure' />
                    <MessageBubble mine={false} text='Cool, when are you free?' />
                    <MessageBubble mine={true} text='I dont know yet' />
                    <MessageBubble mine={false} text='OK, let me know' />
                    <MessageBubble mine={true} text='No problem' />
                    <MessageBubble mine={false} text='You want to meetup ?' />
                    <MessageBubble mine={true} text='Yes for sure' />
                    <MessageBubble mine={false} text='Cool, when are you free?' />
                    <MessageBubble mine={true} text='I dont know yet' />
                    <MessageBubble mine={false} text='OK, let me know' />
                    <MessageBubble mine={true} text='No problem' />
                    <MessageBubble mine={false} text='You want to meetup ?' />
                    <MessageBubble mine={true} text='Yes for sure' />
                    <MessageBubble mine={false} text='Cool, when are you free?' />
                    <MessageBubble mine={true} text='I dont know yet' />
                    <MessageBubble mine={false} text='OK, let me know' />
                    <MessageBubble mine={true} text='No problem last message' />


                </ScrollView>

                {/* <TouchableOpacity onPress={() => scrollView.current.scrollToEnd()}> */}
                <View style={styles.messageContainer} >
                    {/* <TextInput autoFocus={true} placeholder="Enter your comment here" multiline={true} style={styles.commentInput} numberOfLines={3} onChangeText={(text) => setComment(text)} /> */}
                    <TextInput onFocus={() => scrollView.current.scrollToEnd()} autoFocus={false} placeholder="Type a message..." multiline={true} style={styles.commentInput} numberOfLines={3} />
                    {/* <TouchableOpacity onPress={() => publishComment()}> */}
                    <TouchableOpacity>
                        <FontAwsome name='send-o' color='blue' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View>
                {/* </TouchableOpacity> */}
                {/* <TextInput placeholder='Message...' /> */}
            </View>


        </KeyboardAvoidingView >
    )
}

export default ChatWithOtherUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowHeight / 45,

        flex: 1,
        //  justifyContent: "space-around"
    },
    barContainer: {

        // justifyContent: 'flex-',
        alignItems: 'center',
        //  marginLeft: 30,
        marginTop: windowHeight / 40,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    IconContainer: {
        //flex: 1,
        // flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end',

        // justifyContent: 'flex-end'
        marginLeft: windowWidth / 2.5,
        // marginTop: windowHeight / 40,
        // flexDirection: 'row',
        // paddingLeft: windowWidth / 100,
        // paddingRight: windowWidth / 100,


    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: windowWidth / 30
    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    commentInput: {
        maxWidth: '90%'
    },
    messageContainer: {
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: windowWidth / 70,
        height: 60,
        borderRadius: 20
    }

})
