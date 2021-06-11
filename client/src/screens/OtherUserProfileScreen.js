import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import MyOverlay from '../components/MyOverlay';
import { Avatar } from 'react-native-elements';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import CommentsScreens from './CommentsScreens';
import AppLoading from 'expo-app-loading';
import { Divider } from 'react-native-elements';
import { Appbar, Button } from 'react-native-paper';
import { Rating } from 'react-native-elements';
import UserReviews from './UserReviews';

const OtherUserProfileScreen = (props) => {
    const { userId } = props.route.params;
    const [userAge, setUserAge] = useState(null);
    const [userBio, setUserBio] = useState(null);
    const [userOccupation, setUserOccupation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [userHobbies, setUserHobbies] = useState("");
    const [userName, setUserName] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userGold, setUserGold] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [reviewsCount, setReviewsCount] = useState(null);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [isReviewsVisible, setIsReiviewsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    let userLong = useSelector(state => state.user.userLong);
    let userLat = useSelector(state => state.user.userLat);



    useEffect(() => {
        fetchUserDetails()

        addMemberInteraction()
        if (commentsToShow.length > 0) {
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


    let currentMemberId = useSelector(state => state.auth.userId);
    const userDetailsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getmyprofile/${userId}`

    const fetchUserDetails = async () => {
        const res = await axios(userDetailsFetchURL);
        setUserAge(res.data.age)
        setUserBio(res.data.bio)
        setUserName(res.data.fullName)
        setUserImage(res.data.pictureUrl)
        setUserRating(res.data.rating)
        setUserGold(res.data.goldMember)

        res.data.reviewsCount == 1 ? setReviewsCount(res.data.reviewsCount + " Review") : setReviewsCount(res.data.reviewsCount + " Reviews")
        let cityName = res.data.city.replace(/,[^,]+$/, "")
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

    const addMemberInteraction = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let body = {
            memberId: currentMemberId,
            otherMemberId: userId,
            type: 'Profile',
        }
        const addMemberInteractionUrl = 'https://proj.ruppin.ac.il/bgroup14/prod/api/member/addInteractionMember'
        try {
            const res = await axios.post(addMemberInteractionUrl, body, config);

        } catch (error) {
            console.log(error)
        }
    }


    const fetchUserPosts = async () => {
        if (userLong || !userLat) {
            try {
                const getLastLocationUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getmemberlastlocation/${userId}`
                const res = await axios(getLastLocationUrl);
                userLong = res.data.lastLocationLong;
                userLat = res.data.lastLocationLat;

            } catch (error) {
                console.log(erorr)
            }

        }
        const userPostsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getuserposts/${userId}/${userLong}/${userLat}/`

        try {

            const res = await axios(userPostsFetchURL);

            setUserPosts(res.data);
        } catch (error) {
            console.log(error)
        }



    }



    const showComments = (comments) => {
        setCommentsToShow(comments)

    }
    const closeCommentsScreen = () => {
        setIsCommentsVisible(false)
        setCommentsToShow([])

    }
    const goToOtherUserProfile = (member_id) => {

        closeCommentsScreen();
        closeReviewsScreen();
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


        try {

            const res = await axios(getChatRoomIdUrl);

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

    const closeReviewsScreen = () => {
        setIsReiviewsVisible(false)
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
            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }} >

                <Appbar.Content title={userName} />

            </Appbar.Header>


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
                        avatarStyle=
                        {
                            userGold ? {

                                borderWidth: 3,
                                borderColor: '#DAA520',
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
                    </View>
                    {userHobbies.length > 0 ? <View style={{ flexDirection: 'row', marginTop: windowHeight / 70 }}>
                        <Text style={{ fontWeight: 'bold' }} >Hobbies: </Text><Text>{userHobbies}</Text>

                    </View> : null}
                    <View style={{ flexDirection: 'row', marginTop: windowHeight / 70, maxWidth: windowWidth / 1.5 }}>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>"{userBio}"</Text>

                    </View>




                </View>
                {userPosts.length == 0 ? <View style={{ alignItems: 'center', marginTop: windowHeight / 10 }}>
                    <Icon name="person-circle-outline" size={72} />
                    <Text style={{ fontSize: 22 }}>No Posts Yet </Text>

                </View> : null}

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
                        return <View key={post.postId}>
                            <Post post={post} showComments={(comments) => showComments(comments)}
                                refreshPage={() => setNewComment(true)} currentMemberId={currentMemberId}
                                goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                                goToChatWithUser={(currentMemberId, member_id) => goToChatWithUser(currentMemberId, member_id)} />
                            <Divider style={{ height: 6, marginTop: windowHeight / 80, marginBottom: windowHeight / 100, backgroundColor: '#d9d9d9' }} />

                        </View>


                    })}
                </View>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default OtherUserProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    inner: {
        padding: windowWidth / 90,

        flex: 1,
    },

    barContainer: {
        marginBottom: windowHeight / 40,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
    chatIconContainer: {
        alignItems: 'flex-end',
        height: 0
    },

    chatIcon: {
        marginTop: windowHeight / 25,
        marginRight: windowWidth / 5

    },
    profileImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: windowHeight / 30,
        alignItems: 'center',

    },
    usernameContainer: {
        alignItems: 'center',
        padding: 10
    },
    usernameText: {
        fontSize: 24
    },
    personalInfoContainer: {

        alignItems: 'center'
    },
    userPostsContainer: {

    },
    ratingContainer: {
        alignItems: 'center',
        marginVertical: windowHeight / 100
    }






})
