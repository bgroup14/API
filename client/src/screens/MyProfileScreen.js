import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyIcon from 'react-native-vector-icons/Ionicons';
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
import { Divider } from 'react-native-elements';

import { Appbar, Button } from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import UserReviews from './UserReviews';

import { LOGOUT } from '../../store/actions/types';




const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


const MyProfileScreen = (props) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userAge, setUserAge] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userBio, setUserBio] = useState(null);
    const [userOccupation, setUserOccupation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [userGold, setUserGold] = useState(false);
    const [reviewsCount, setReviewsCount] = useState(null);
    const [userHobbies, setUserHobbies] = useState("");
    const dispatch = useDispatch();





    const [posts, setPosts] = useState([]);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getallposts`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [isReviewsVisible, setIsReiviewsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        fetchUserDetails()
        fetchUserPosts()
        if (commentsToShow.length > 0) {
            //console.log(commentsToShow)
            setIsCommentsVisible(true)
        }


    }, [commentsToShow])



    useFocusEffect(
        React.useCallback(() => {
            // fetchPosts()
            fetchUserDetails()
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
    let userId = useSelector(state => state.auth.userId);
    const userDetailsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getmyprofile/${userId}`

    const fetchUserDetails = async () => {
        //  console.log("fetching user details...");
        const res = await axios(userDetailsFetchURL);
        console.log(res.data)
        setUserAge(res.data.age)
        setUserBio(res.data.bio)
        setUserRating(res.data.rating)
        setUserGold(res.data.goldMember)
        res.data.reviewsCount == 1 ? setReviewsCount(res.data.reviewsCount + " Review") : setReviewsCount(res.data.reviewsCount + " Reviews")
        //  console.log("user image is :" + res.data.pictureUrl)
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

    }

    const userPostsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getuserposts/${userId}/0/0/`
    const fetchUserPosts = async () => {
        //   console.log("fetching user posts...")
        const res = await axios(userPostsFetchURL);
        setUserPosts(res.data);
    }


    let userName = useSelector(state => state.user.userName);
    // let userImage = useSelector(state => state.user.userImage);
    ///DELETE THIS!


    // const userId = useSelector(state => state.auth.userId);
    const showComments = (comments) => {
        setCommentsToShow(comments)

    }
    const closeCommentsScreen = () => {
        setIsCommentsVisible(false)
        setCommentsToShow([])

    }
    const closeReviewsScreen = () => {
        setIsReiviewsVisible(false)
    }

    const goToOtherUserProfile = (member_id) => {

        closeCommentsScreen();
        closeReviewsScreen();
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

    const editProfile = () => {

        setIsMenuVisible(false)
        props.navigation.navigate('EditProfile')


    }
    const editFeedSettings = () => {

        setIsMenuVisible(false)
        props.navigation.navigate('EditFeedSettingsScreen')


    }

    const logout = () => {

        setIsMenuVisible(false)
        dispatch({
            type: LOGOUT,
            payload: null
        });

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
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => closeCommentsScreen()}  >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>
            <MyOverlay isVisible={isReviewsVisible} onBackdropPress={() => closeReviewsScreen()}  >
                <UserReviews userId={userId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>


            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }}>
                <Appbar.Content title="My Profile" />
                {/* <Appbar.Action icon="magnify" onPress={() => { }} /> */}
                <Appbar.Action icon={MORE_ICON} onPress={() => setIsMenuVisible(true)} />
            </Appbar.Header>
            <DotsMenuOverlay isVisible={isMenuVisible} onBackdropPress={() => setIsMenuVisible(false)}  >
                <DotsMenu editProfile={() => editProfile()} editFeedSettings={() => editFeedSettings()} logout={() => logout()} />
            </DotsMenuOverlay>
            {/* <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} /> */}
            {/* <MyLinearGradient firstColor="#3b5998" secondColor="#3b5998" height={90} /> */}

            {/* <View style={styles.barContainer}>
                <DotsMenuOverlay isVisible={isMenuVisible} onBackdropPress={() => setIsMenuVisible(false)}  >
                    <DotsMenu editProfile={() => editProfile()} editFeedSettings={() => editFeedSettings()} />
                </DotsMenuOverlay>
                <Text style={styles.barText}>My Profile</Text>
                <Icon
                    style={styles.dotsMenu}
                    name='dots-vertical'
                    onPress={() => setIsMenuVisible(true)}
                />
            </View> */}
            <ScrollView style={styles.inner}>

                <View style={styles.profileImageContainer}>
                    <Avatar
                        size='xlarge'
                        avatarStyle=
                        {
                            userGold ? {

                                borderWidth: 3,
                                borderColor: '#FFD700',
                            } : null}
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

                    {userHobbies.length > 0 ? <View style={{ flexDirection: 'row', marginTop: windowHeight / 70 }}>
                        <Text style={{ fontWeight: 'bold' }} >Hobbies: </Text><Text>{userHobbies}</Text>

                    </View> : null}


                    <View style={{ flexDirection: 'row', marginTop: windowHeight / 70, maxWidth: windowWidth / 1.5 }}>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>"{userBio}"</Text>

                    </View>




                </View>
                {userPosts.length == 0 ? <View style={{ alignItems: 'center', marginTop: windowHeight / 10 }}>
                    <MyIcon name="person-circle-outline" size={72} />
                    <Text style={{ fontSize: 22 }}>No Posts Yet </Text>

                </View> : null}

                {/* {userPosts.length == 0 ? <View style={{ alignItems: 'center', marginTop: windowHeight / 10 }}>
                    <Text style={{ fontSize: 22 }}>You have no posts yet </Text>

                </View> : null} */}



                <View style={styles.userPostsContainer}>
                    {userRating > 0 ?
                        <View style={styles.ratingContainer} >
                            <Rating readonly fractions={2} startingValue={userRating} imageSize={24} />
                            <View style={{ marginTop: windowHeight / 200 }}>
                                <Text>({userRating} Stars - {reviewsCount})</Text>
                            </View>
                            <Button uppercase={false} mode='text' labelStyle={{ color: 'blue' }} onPress={() => setIsReiviewsVisible(true)}>
                                Show Reviews
                            </Button>
                            {userGold ? <Avatar
                                size='large'
                                // containerStyle={{ marginVertical: 1 }}
                                // rounded
                                source={
                                    require("../../assets/goldMember.png")
                                }
                            /> : null
                            }



                        </View> :
                        null}
                    {userPosts.map((post) => {
                        return <View key={post.postId}><Post post={post} showComments={(comments) => showComments(comments)} refreshPage={() => setNewComment(true)} currentMemberId={userId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
                            <Divider style={{ height: 6, marginTop: windowHeight / 80, marginBottom: windowHeight / 100, backgroundColor: '#d9d9d9' }} />

                        </View>
                        // return <Post post={post} key={post.postId} currentMemberId={userId} />
                        // return <Post text={post.text} cityName={post.cityName} />
                    })}
                </View>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default MyProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowWidth / 90,

        // padding: windowHeight / 45,

        flex: 1,
        //  justifyContent: "space-around"
    },

    barContainer: {
        // flex: 1,
        marginBottom: windowHeight / 35,
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
        marginTop: windowHeight / 150


    },
    dotsMenu: {
        color: '#ffffff',
        fontSize: 32,

    },
    profileImageContainer: {
        //  flex: 1,
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
        // height: windowHeight / 6,

        alignItems: 'center'
    },
    userPostsContainer: {
        // marginTop: 0,
        // alignItems: 'stretch',
        //width: '100%'
    },
    ratingContainer: {
        alignItems: 'center',
        marginVertical: windowHeight / 100
    }





})
