import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import MyOverlay from '../components/MyOverlay';
import { Avatar } from 'react-native-elements';
import MyLinearGradient from '../components/MyLinearGradient';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import CommentsScreens from './CommentsScreens';
import DotsMenu from './DotsMenu';
import DotsMenuOverlay from '../components/DotsMenuOverlay';
import AppLoading from 'expo-app-loading';
import Spinner from 'react-native-loading-spinner-overlay';
import { Divider } from 'react-native-elements';




//


const OtherUserProfileScreen = (props) => {
    const { userId } = props.route.params;
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userAge, setUserAge] = useState(null);
    const [userBio, setUserBio] = useState(null);
    const [userOccupation, setUserOccupation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [userHobbies, setUserHobbies] = useState("");
    const [userName, setUserName] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [isReady, setIsReady] = useState(false);



    const [posts, setPosts] = useState([]);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getallposts`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    let userLong = useSelector(state => state.user.userLong);
    let userLat = useSelector(state => state.user.userLat);



    useEffect(() => {
        fetchUserDetails()

        if (commentsToShow.length > 0) {
            console.log(commentsToShow)
            setIsCommentsVisible(true)
        }


    }, [commentsToShow])



    useFocusEffect(
        React.useCallback(() => {
            // fetchPosts()
            fetchUserPosts()
            setNewComment(false)

        }, [newComment])
    )



    // useFocusEffect(
    //     React.useCallback(() => {
    //         // fetchPosts()
    //         //   setNewComment(false)

    //     }, [])
    // )
    let currentMemberId = useSelector(state => state.auth.userId);
    const userDetailsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getmyprofile/${userId}`

    const fetchUserDetails = async () => {
        console.log("fetching user details!!");

        const res = await axios(userDetailsFetchURL);
        //console.log(res.data.city + "cityy")
        // console.log(res.data.fullName)
        // console.log(res.data.pictureUrl)
        setUserAge(res.data.age)
        setUserBio(res.data.bio)
        setUserName(res.data.fullName)
        setUserImage(res.data.pictureUrl)
        let cityName = res.data.city.replace(/,[^,]+$/, "")
        // console.log(str)
        setUserCity(cityName)
        setUserOccupation(res.data.occupation)
        let hobbiesArray = res.data.hobbies
        let hobbiesString = "";
        hobbiesArray.forEach(element => {
            hobbiesString += element.name + ', ';
        });

        hobbiesString = hobbiesString.replace(/,\s*$/, "");
        setUserHobbies(hobbiesString)
        fetchUserPosts()

    }

    const userPostsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getuserposts/${userId}/${userLong}/${userLat}/`
    console.log("userLat is " + userLat)
    console.log("userLong is " + userLong)

    const fetchUserPosts = async () => {
        console.log("fetching user posts...")
        const res = await axios(userPostsFetchURL);
        setUserPosts(res.data);


    }


    // let userName = userName;
    // let userImage = useSelector(state => state.user.userImage);
    ///DELETE THIS!


    // const userId = useSelector(state => state.auth.userId);
    const showComments = (comments) => {
        setCommentsToShow(comments)

    }
    const toggleCommentsScreen = () => {
        setIsCommentsVisible(false)
        setCommentsToShow([])

    }
    const goToOtherUserProfile = (member_id) => {

        toggleCommentsScreen();
        if (currentMemberId == member_id) {
            props.navigation.navigate('MyProfile')
        }
        else {
            props.navigation.navigate('OtherUserProfileScreen', {
                userId: member_id
            })
        }

    }

    const getChatRoomIdUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatRoomId/${currentMemberId}/${userId}`

    const goToChatWithUser = async () => {

        console.log(userId)// this is gal id
        console.log(currentMemberId)
        try {

            console.log("Checking Room Id...")
            const res = await axios(getChatRoomIdUrl);
            console.log(res.data);
            const { chatRoomId, otherMemberName, otherMemberId, otherMemberImage } = res.data


            props.navigation.navigate('ChatWithOtherUser', {
                chatRoomId: chatRoomId,
                otherMemberName: otherMemberName,
                otherMemberImage: otherMemberImage,
                otherMemberId: otherMemberId

            })


        } catch (error) {
            console.log(error)

        }



    }
    if (!isReady) {
        return (
            <View>

                <AppLoading
                    startAsync={fetchUserDetails}
                    onFinish={() => setIsReady(true)}
                    onError={console.warn}
                />
            </View>
        );
    }



    return (
        <KeyboardAvoidingView style={styles.container} >
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}  >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>
            <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
            <View style={styles.barContainer}>

                <Text style={styles.barText}>{userName}</Text>
            </View>

            <ScrollView style={styles.inner}>

                <View style={styles.chatIconContainer}>
                    <Icon
                        style={styles.chatIcon}
                        size={32}
                        name='chatbubbles-outline'
                        onPress={() => goToChatWithUser()}
                    />
                </View>
                <View style={styles.profileImageContainer}>
                    <Avatar
                        size='xlarge'
                        containerStyle={{ marginTop: windowHeight / 100 }}
                        rounded
                        source={{
                            uri:
                                userImage,
                        }}
                    />

                </View>


                <View style={styles.usernameContainer}>
                    <Text style={styles.usernameText}>{userName}</Text>
                </View>
                <View style={styles.personalInfoContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, marginHorizontal: 5, fontStyle: 'italic' }}>{userAge} years old </Text>
                        <Text>|</Text>
                        <Text style={{ fontSize: 16, marginHorizontal: 5, fontStyle: 'italic' }}> {userOccupation} </Text>
                        <Text>|</Text>
                        <Text style={{ fontSize: 16, marginHorizontal: 5, fontStyle: 'italic' }}> {userCity}</Text>
                        {/* <Text style={{ fontSize: 16 }}>{userCity}</Text> */}
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: windowHeight / 70, maxWidth: windowWidth / 1.5 }}>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>"{userBio}"</Text>

                    </View>
                    {userHobbies.length > 0 ? <View style={{ flexDirection: 'row', marginTop: windowHeight / 70 }}>
                        <Text style={{ fontWeight: 'bold' }} >Hobbies: </Text><Text>{userHobbies}</Text>

                    </View> : null}



                </View>
                {userPosts.length == 0 ? <View style={{ alignItems: 'center', marginTop: windowHeight / 10 }}>
                    <Text style={{ fontSize: 22 }}>{userName} has no posts yet </Text>

                </View> : null}

                <ScrollView contentContainerStyle={styles.userPostsContainer}>
                    {userPosts.map((post) => {
                        // console.log(post)
                        return <View key={post.postId}>
                            <Post post={post} showComments={(comments) => showComments(comments)}
                                refreshPage={() => setNewComment(true)} currentMemberId={currentMemberId}
                                goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                                goToChatWithUser={(currentMemberId, member_id) => goToChatWithUser(currentMemberId, member_id)} />
                            <Divider style={{ height: 6, marginTop: windowHeight / 80, marginBottom: windowHeight / 100, backgroundColor: '#d9d9d9' }} />

                        </View>
                        // return <Post post={post} key={post.postId} currentMemberId={userId} />
                        // return <Post text={post.text} cityName={post.cityName} />

                    })}
                </ScrollView>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default OtherUserProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        // padding: windowHeight / 45,
        padding: windowWidth / 90,

        flex: 1,
        //  justifyContent: "space-around"
    },

    barContainer: {
        // flex: 1,
        marginBottom: windowHeight / 40,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //  marginLeft: 30,
        marginTop: windowHeight / 22,
        flexDirection: 'row',
        marginHorizontal: windowHeight / 40

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',

    },
    chatIconContainer: {
        //  flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        // marginBottom: 0,
        height: 0
    },

    chatIcon: {
        marginTop: windowHeight / 25,
        marginRight: windowWidth / 5
        // marginLeft: 10
        //   color: '#ffffff',
        //  fontSize: 32,

    },
    profileImageContainer: {
        //  flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: windowHeight / 30,
        alignItems: 'center',
        //justifyContent: 'flex-end'

    },
    usernameContainer: {
        alignItems: 'center',
        padding: 10
    },
    usernameText: {
        fontSize: 24
    },
    personalInfoContainer: {
        height: windowHeight / 6,

        alignItems: 'center'
    },
    userPostsContainer: {
        //marginTop: 0,
        alignItems: 'stretch',
        //width: '100%'
    }





})
