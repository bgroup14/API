import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/AntDesign';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Button } from 'react-native-elements';

import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MyOverlay from '../components/MyOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications'

import { NEW_MESSAGE, RECEIVED_USER_COORDINATES } from '../../store/actions/types';
import AppLoading from 'expo-app-loading';
import Spinner from 'react-native-loading-spinner-overlay';












import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Divider } from 'react-native-elements';
import axios from 'axios';


import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FeedFilterScreen from './FeedFilterScreen';
import CommentsScreens from './CommentsScreens';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { set } from 'react-native-reanimated';









const HomeScreen = (props) => {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const userId = useSelector(state => state.auth.userId);
    const userLong = useSelector(state => state.user.userLong);
    // let userLong = null;
    let userLat = useSelector(state => state.user.userLat);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/${userId}`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [categoryNameToSend, setCategoryameToSend] = useState(null);
    const [postsFilteredObj, setPostsFilteredObj] = useState(null);
    const [restartComponent, setRestartComponent] = useState(1);
    const [categoriesToShow, setCategoriesToShow] = useState([]);
    const [pushNotificationToken, setPushNotificationToken] = useState(null);
    const [myLong, setMyLong] = useState(null);
    const [myLat, setMyLat] = useState(null);
    const [filterActivated, setFilterACtivated] = useState(false);





    const notificationListener = useRef();
    const responseListener = useRef();
    const [notification, setNotification] = useState(false);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });


    const receivedNewMessage = async () => {
        console.log("trying to change redux msg recieved state...")
        dispatch({
            type: NEW_MESSAGE,
            payload: null
        });
    }





    useFocusEffect(
        React.useCallback(() => {
            setCategoryameToSend(null)
            getUserCurrentLocationAndFecthPosts();
            console.log("token is " + pushNotificationToken)
            // console.log("redux newMessage is: " + newMessage)
            setRestartComponent(Date.now)
            let categories = [
                { label: 'Sport', value: 'Sport', icon: () => <Icon name="dribbble" size={22} color="#000000" /> },
                { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
                { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
                { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
                { label: 'General', value: 'General', icon: () => <Icon name="hearto" size={24} color="#000000" /> },
            ]
            setCategoriesToShow(categories)
            setPostsFilteredObj(null)



            //  fetchPosts(postsFilteredObj)
            setNewComment(false)
            // console.log("nenenrewnfewnfwnfwn" + userLong)

        }, [newComment])
    )







    useEffect(() => {

        //GET USER CURRENT LCOATION
        // getUserCurrentLocationAndFecthPosts();
















        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        //when user in app will preform this
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log("Push data screen open:")
            // console.log(notification)
            let notificationBody = JSON.parse(notification.request.trigger.remoteMessage.data.body)
            // let notificationBody = JSON.parse(notification.request)
            console.log(notificationBody)
            switch (notificationBody.functionToRun) {
                case "receivedNewMessage":
                    receivedNewMessage()
                    break;
                case "receivedNewMeetingInvitation":
                    receivedNewMessage()

                default:
                    break;
            }
            // if (notificationBody.functionToRun == "receivedNewMessage" || notificationBody.functionToRun == "receivedNewMeetingInvitation") {
            //     receivedNewMessage()
            //     //ADD NOTIFICATION TO NOTIFIACTION SCREEN BAR AND TO RECIEVED A MESSAGE 
            // }

        });

        //When user not in the app will preform this
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Push data screen close:")
            console.log(response.notification.request.trigger.remoteMessage.data.body);
            let notificationBody = JSON.parse(response.notification.request.trigger.remoteMessage.data.body)
            // console.log(notificationBody)
            switch (notificationBody.functionToRun) {
                case "receivedNewMessage":
                    console.log("entering chat with other user...")
                    props.navigation.navigate('ChatWithOtherUser', {
                        chatRoomId: notificationBody.chatRoomId,
                        otherMemberName: notificationBody.otherMemberName,
                        otherMemberImage: notificationBody.otherMemberImage,
                        otherMemberId: notificationBody.otherMemberId
                    })

                    break;
                case "receivedNewMeetingInvitation":
                    console.log("entering chat with other user...")
                    props.navigation.navigate('ChatWithOtherUser', {
                        chatRoomId: notificationBody.chatRoomId,
                        otherMemberName: notificationBody.otherMemberName,
                        otherMemberImage: notificationBody.otherMemberImage,
                        otherMemberId: notificationBody.otherMemberId
                    })

                default:
                    break;
            }




        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);



    useEffect(() => {
        if (pushNotificationToken == null) {
            checkPushNotifications();
        }

        if (commentsToShow.length > 0) {
            setIsCommentsVisible(true)
        }


    }, [commentsToShow])


    useEffect(() => {
        if (pushNotificationToken != null) {
            //SEND NOTIFICATION TO SERVER

            sendPushTokenToServer();

        }

    }, [pushNotificationToken])

    const sendPushTokenToServer = async () => {
        const fetchNotificationIdURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/setnotificationid/${userId}/${pushNotificationToken}`
        try {
            console.log("sending push token to server...")
            const res = await axios.post(fetchNotificationIdURL);
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }


    }


    const checkPushNotifications = async () => {

        try {
            var today = new Date().toDateString();
            const lastTimeTokenTaken = await AsyncStorage.getItem('lastTimeTokenTaken')
            if (lastTimeTokenTaken == null || lastTimeTokenTaken != today) {
                //GET TOKEN FROM EXPO
                registerForPushNotificationsAsync()
                    .then((token) => {
                        //console.log('token from app.js=', token);
                        // this.setState({ token });
                        setPushNotificationToken(token)
                        //console.log('state.token from app.js=', this.state.token);
                    });

                await AsyncStorage.setItem('lastTimeTokenTaken', today)




            }
            else {
                console.log("Push token is updated to : " + lastTimeTokenTaken)
            }
        }
        catch (error) {
            console.log(error)
        }

    }







    const fetchPosts = async (obj) => {


        //console.log(obj)


        const body = JSON.stringify(obj)
        console.log("body that will be send to filter post is: " + body)

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await axios.post(postsFetchURL, body, config);

            setPosts(res.data)

        } catch (err) {
            console.log(err)
        }
        // }

        //     // try {

        //     //     const config = {
        //     //         headers: {
        //     //             'Content-Type': 'application/json'
        //     //         }
        //     //     }

        //     //     const res = await axios.post(postsFetchURL, body, config);

        //     //     setPosts(res.data)

        //     // } catch (err) {
        //     //     console.log(err)
        //     // }


        //     // if (filterObj == null) {
        //     //     try {

        //     //         console.log(userId)

        //     //         ///HERE WILL IMPLEMENT SMART ELEMNT

        //     //         const res = await axios.post(postsFetchURL);
        //     //         // const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/161");
        //     //         console.log(res.data);


        //     //         setPosts(res.data)

        //     //     } catch (err) {
        //     //         console.log("error in fetching post")
        //     //         console.log(err.message)
        //     //     }

        //     // }

        //     // else {




        //     let objectLength = Object.keys(obj).length;


        //     var filterdObjToSend;
        //     if (objectLength == 1) {
        //         filterdObjToSend = {

        //             ...filterObj,
        //             ...postsFilteredObj
        //         }
        //     }
        //     else {
        //         console.log(object)
        //         filterdObjToSend = {
        //             ...filterObj
        //         }
        //     }

        //     console.log("not empty")
        //     const body = JSON.stringify(filterdObjToSend)
        //     console.log("body that will be send to filter post is: " + body)
        //     try {

        //         const config = {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         }

        //         const res = await axios.post(postsFetchURL, body, config);

        //         setPosts(res.data)

        //     } catch (err) {
        //         console.log(err)
        //     }
        //     // }


        // }

    }


    const fetchFilteredPosts = async (filteredPostObj) => {

        //console.log(filteredPostObj)
        let obj = {
            filterActivated: true,
            meetingLocationLong: myLong,
            meetingLocationLat: myLat,
            categoryName: categoryNameToSend,
            ...filteredPostObj
        }
        fetchPosts(obj)

        // let objToSend = {
        //     ...filteredPostObj,
        //     categoryName: categoryNameToSend
        // }
        // fetchPosts(objToSend)

        // //In case we go to anoher screen so useFocus will be activated and will dend this obj to the server 
        setPostsFilteredObj(filteredPostObj);
        // let body = JSON.stringify(objToSend)
        // console.log(body)



        setIsFilterVisble(false)


    };

    const filterByCategory = (categoryName) => {
        let category = {
            categoryName
        }
        var obj;
        //NOW WE CHECK IF POSTS WERE ALREADY FILTERED
        if (postsFilteredObj != null) {
            obj = {
                ...postsFilteredObj,
                categoryName,
                filterActivated: true,
                meetingLocationLong: myLong,
                meetingLocationLat: myLat

            }
            fetchPosts(obj)

        } else {
            obj = {
                categoryName,
                filterActivated: false,
                meetingLocationLong: myLong,
                meetingLocationLat: myLat
            }
        }

        setCategoryameToSend(categoryName);
        fetchPosts(obj)
        // console.log("obj after changing category is:")
        // console.log(obj)
        return null;
        fetchPosts(category)




    }

    let categories = [
        // { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
        { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
        { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
        { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
        { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
        { label: 'General', value: 'General', icon: () => <MaterialIcons name="volunteer-activism" size={24} color="#000000" /> },
    ]



    // let userName = useSelector(state => state.auth.userName);
    let userName = useSelector(state => state.user.userName);



    ///DELETE THIS!
    //   console.log("user name fromn rerdux is:" + userName)
    if (userName === null || userName === undefined) {
        userName = 'Alan skverer'
    }
    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const showComments = (comments) => {
        setCommentsToShow(comments)

    }
    const toggleCommentsScreen = () => {
        setIsCommentsVisible(false)
        setCommentsToShow([])

    }




    const goToOtherUserProfile = (member_id) => {

        toggleCommentsScreen();
        // alert(member_id)
        if (userId == member_id) {
            props.navigation.navigate('MyProfile')
        }
        else {
            props.navigation.navigate('OtherUserProfileScreen', {
                userId: member_id
            })
        }
    }

    const goToChatWithUser = async (currentMemberId, member_id) => {
        console.log(currentMemberId)
        console.log(member_id)
        const getChatRoomIdUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatRoomId/${currentMemberId}/${member_id}`


        try {

            console.log("Checking Room Id...")
            const res = await axios(getChatRoomIdUrl);
            // console.log(res.data);
            const { chatRoomId, otherMemberName, otherMemberId, otherMemberImage } = res.data

            props.navigation.navigate('ChatWithOtherUser', {
                chatRoomId: chatRoomId,
                otherMemberName: otherMemberName,
                otherMemberImage: otherMemberImage,
                otherMemberId: member_id

            })

        } catch (error) {
            console.log(error)

        }

    }

    //goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
    const getUserCurrentLocationAndFecthPosts = async () => {

        // return null;
        var obj;
        // console.log("user long is :" + userlong)
        if (userLong == null) {
            console.log("getting user location.........")
            console.log("user long is null!!!!")
            console.log(userLong)


            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                // setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            //setLocation(location);


            let regionName = await Location.reverseGeocodeAsync({ longitude: location.coords.longitude, latitude: location.coords.latitude });
            console.log(regionName[0].city)
            obj = {
                filterActivated: false,
                meetingLocationLong: location.coords.longitude,
                meetingLocationLat: location.coords.latitude
            }
            fetchPosts(obj)
            setMyLat(location.coords.latitude);
            setMyLong(location.coords.longitude);

            dispatch({
                type: RECEIVED_USER_COORDINATES,
                payload: {
                    userLong: location.coords.longitude,
                    userLat: location.coords.latitude
                }
            });
            console.log("setting is ready == true")
            setTimeout(() => {
                setIsReady(true)
                setSpinner(false)
            }, 800);



        }
        else {
            console.log("not getting user location....")
            console.log("user long is not null!!!!")
            console.log(userLong)


            obj = {
                filterActivated: false,
                meetingLocationLong: userLong,
                meetingLocationLat: userLat
            }
            fetchPosts(obj)

            console.log("setting is ready == true")
            setTimeout(() => {
                setIsReady(true)
                setSpinner(false)
            }, 800);

        }








    }

    if (!isReady) {
        return (
            <View>

                <AppLoading
                    startAsync={getUserCurrentLocationAndFecthPosts}
                    onFinish={() => console.log("finished app loading")}
                    // onFinish={() => setIsReady(true)}
                    // onFinish={() => setTimeout(() => {
                    //     setIsReady(true);
                    //     setSpinner(false)
                    // }, 500)}
                    onError={console.warn}
                />
                <Spinner
                    visible={spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </View>
        );
    }




    return (
        <KeyboardAvoidingView style={styles.container}  >
            <MyOverlay isVisible={isFilterVisible} onBackdropPress={() => setIsFilterVisble(false)}  >
                <FeedFilterScreen closeFilter={() => setIsFilterVisble(false)} sendFilteredObj={(filteredPostObj => fetchFilteredPosts(filteredPostObj))} />
            </MyOverlay>
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}   >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>
            <View style={styles.inner}>
                {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
                <MyLinearGradient firstColor="#3b5998" secondColor="#3b5998" height={90} />

                {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={80} /> */}


                <View style={styles.barContainer}><Text style={styles.barText} >Feed</Text>
                    <Icon
                        style={styles.bellIcon}
                        name='bells'
                        onPress={() => props.navigation.navigate('Notifications')}

                    />
                </View>
                {/* <View style={styles.categoryContainer}>
                        <Text>Category dropdown</Text>
                    </View> */}


                <View style={styles.selectCategoryContainer} key={restartComponent} >
                    <DropDownPicker
                        placeholder="Select Category"
                        style={{ backgroundColor: '#fff' }}
                        // dropDownStyle={{ backgroundColor: 'red' }}
                        //defaultValue={restartComponent}
                        items={categoriesToShow}
                        // items={categories}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{
                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => filterByCategory(item.value)}

                    // onChangeItem={item => setPostCategory(item.value)}
                    />
                    <TouchableOpacity onPress={() => setIsFilterVisble(true)} style={{ flex: 1 }}>

                        <Icon name='filter' size={32} style={styles.filterICon} />
                    </TouchableOpacity>
                </View>

                {posts.length > 0 ?
                    <ScrollView contentContainerStyle={styles.postsContainer}>
                        {posts.map((post) => {
                            return <View key={post.postId}>
                                <View><Post post={post} showComments={(comments) => showComments(comments)}
                                    refreshPage={() => setNewComment(true)} currentMemberId={userId}
                                    goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                                    goToChatWithUser={(currentMemberId, member_id) => goToChatWithUser(currentMemberId, member_id)} />
                                </View>
                                <View style={{ margin: windowWidth / 70 }}>

                                </View>
                            </View>
                        })}


                    </ScrollView> :
                    <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.3, marginTop: windowWidth / 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18 }}>We couldn't find posts that matches your posts filter request</Text>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen') */}
                        <TouchableOpacity onPress={() => setIsFilterVisble(true)
                        }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to try again</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            <View>
                                <Text style={{ width: 50, textAlign: 'center', fontSize: 16 }}>OR</Text>
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        </View>
                        <View style={{ marginHorizontal: windowWidth / 14, maxWidth: windowWidth / 1.2 }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')
                            }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to update your feed settings</Text></TouchableOpacity>
                        </View>
                    </View>}

                {posts.length <= 2 && posts.length != 0 ? <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>couldn't find what you're looking for?</Text>

                    <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')}>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>Click here to update your feed settings</Text>
                    </TouchableOpacity>
                </View>
                    : null}

            </View>
        </KeyboardAvoidingView >
    )


}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        backgroundColor: '#d9d9d9',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowWidth / 90,

        flex: 1,
        //  justifyContent: "space-around"
    },
    categoryContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 60,

    },

    barContainer: {
        // flex: 1,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //  marginLeft: 30,
        marginTop: windowHeight / 22,
        flexDirection: 'row',
        marginHorizontal: windowHeight / 40
        // paddingLeft: windowWidth / 100,
        // paddingRight: windowWidth / 100,

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',

    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    selectCategoryContainer:
    {
        //  flex: 1,
        // position: 'relative',
        // backgroundColor: 'red',
        marginTop: windowHeight / 20,
        flexDirection: 'row',
        //alignItems: 'flex-start',
        //  justifyContent: 'space-around',
        marginBottom: windowHeight / 70,
        // width: '100%',
        // marginLeft: windowWidth / 50,
        //borderRadius: 50
    }, dropDownContainer: {

        width: '85%',
        height: windowHeight / 15,

    },
    filterICon: { marginLeft: windowWidth / 25, marginTop: windowHeight / 100 },

    postsContainer: {

        justifyContent: 'flex-start',
        // backgroundColor: '#ffffff'
        //    / flex: 1,
        //   minHeight: 140
        // justifyContent: '',
        //alignItems: 'center'
    },
    userGreetingText: {
        fontSize: 18
    },
    spinnerTextStyle: {
        color: '#FFF'
    },


})
