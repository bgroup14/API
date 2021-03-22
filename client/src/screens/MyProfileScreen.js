import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const MyProfileScreen = (props) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [userAge, setUserAge] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userBio, setUserBio] = useState(null);
    const [userOccupation, setUserOccupation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [userHobbies, setUserHobbies] = useState("");


    const [posts, setPosts] = useState([]);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getallposts`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        fetchUserDetails()
        fetchUserPosts()
        if (commentsToShow.length > 0) {
            console.log(commentsToShow)
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
        console.log("fetching user details...");
        const res = await axios(userDetailsFetchURL);
        //console.log(res.data.city + "cityy")
        setUserAge(res.data.age)
        setUserBio(res.data.bio)
        console.log("user image is :" + res.data.pictureUrl)
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

    const userPostsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getuserposts/${userId}`
    const fetchUserPosts = async () => {
        console.log("fetching user posts...")
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

    const editProfile = () => {

        setIsMenuVisible(false)
        props.navigation.navigate('EditProfile')


    }


    return (
        <KeyboardAvoidingView style={styles.container} >
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}  >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>

            <View style={styles.inner}>
                <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
                <View style={styles.barContainer}>
                    <DotsMenuOverlay isVisible={isMenuVisible} onBackdropPress={() => setIsMenuVisible(false)}  >
                        <DotsMenu editProfile={() => editProfile()} />
                    </DotsMenuOverlay>
                    <Text style={styles.barText}>My Profile</Text>
                    <Icon
                        style={styles.dotsMenu}
                        name='dots-vertical'
                        onPress={() => setIsMenuVisible(true)}
                    />
                </View>
                <View style={styles.profileImageContainer}>
                    <Avatar
                        size='xlarge'
                        containerStyle={{ marginTop: 10 }}
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
                    <View style={{ flexDirection: 'row', marginTop: windowHeight / 70 }}>
                        <Text style={{ fontWeight: 'bold' }} >Hobbies: </Text><Text>{userHobbies}</Text>

                    </View>



                </View>

                <ScrollView contentContainerStyle={styles.userPostsContainer}>
                    {userPosts.map((post) => {
                        return <Post post={post} key={post.postId} showComments={(comments) => showComments(comments)} refreshPage={() => setNewComment(true)} currentMemberId={userId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
                        // return <Post post={post} key={post.postId} currentMemberId={userId} />
                        // return <Post text={post.text} cityName={post.cityName} />
                    })}
                </ScrollView>


            </View>
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
        padding: windowHeight / 45,

        flex: 1,
        //  justifyContent: "space-around"
    },

    barContainer: {
        // flex: 1,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //  marginLeft: 30,
        marginTop: windowHeight / 40,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',

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
        height: windowHeight / 6,

        alignItems: 'center'
    },
    userPostsContainer: {
        //marginTop: 0,
        alignItems: 'stretch',
        //width: '100%'
    }





})
