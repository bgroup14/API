import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Toast } from "native-base";
import * as Font from "expo-font";
import AppLoading from 'expo-app-loading';


import {
    useFonts,
    Ubuntu_400Regular,
    Ubuntu_700Bold

} from '@expo-google-fonts/ubuntu';


import {
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold

} from '@expo-google-fonts/inter'



const Post = (props) => {
    let [fontsLoaded] = useFonts({
        Ubuntu_400Regular,
        Ubuntu_700Bold,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_700Bold
    });
    const { postId, text, cityName, recurring, dateLabel, timeOfDay,
        postCreatorImg, postCreatorName, comments, member_id, distanceFromMe, category, goldenMember } = props.post;
    let currentMemberId = props.currentMemberId;
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState(null);
    let userId = useSelector(state => state.auth.userId);
    let userName = useSelector(state => state.user.userName);
    let commentsLabel = comments.length > 1 ? 'Comments' : 'Comment';

    var postDistance = Math.round(distanceFromMe * 10) / 10
    let postDistanceKM = cityName != "Zoom Meeting" ? `(${postDistance} km)` : '';


    useEffect(() => {


        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
            loadFonts();
        }

    }, [])





    const publishComment = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let commentObj = {
            postId,
            text: comment,
            commentingMemberId: userId

        }
        const body = JSON.stringify(commentObj)



        try {
            //if this will fail (status !=200 ) it will catch the error in the error block
            const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/post/publishcomment", body, config);

            Toast.show({
                text: "Comment published successfully!",
                type: "success",
                duration: 4000
            });
            props.refreshPage();
            setShowCommentInput(false)
            updateCategoryStrength();


        } catch (err) {

            Alert.alert(
                "OOPS!",
                "Error occurred, try again.",
                [

                    { text: "OK" }
                ],
            );



        }

        let now = Math.floor(Date.now() / 1000)
        let obj = {
            memberId: member_id,
            notificationType: 'Comment',
            notificationText: comment,
            otherMemberId: userId,
            unixdate: now
        }

        const notificationBody = JSON.stringify(obj)

        const addNotificationUrl = 'https://proj.ruppin.ac.il/bgroup14/prod/api/member/addNotification';

        try {

            const res = await axios.post(addNotificationUrl, notificationBody, config);


        } catch (error) {
            console.log("error in adding notification to db")
        }
        let pushObj = {
            functionToRun: "receivedNewComment",


        }
        PushFromClient(pushObj)





    }


    const PushFromClient = async (pushObj) => {

        //GET OTHER USER TOKEN ID FROM SERVER
        const fetchOtherUserPushNotificationID = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getnotificationid/${member_id}`
        try {
            const res = await axios(fetchOtherUserPushNotificationID);

            var otherUserNotificationId = res.data;



        } catch (error) {

            console.log(error)
            return null
        }

        let push = {
            to: otherUserNotificationId,
            title: `${userName}commented on your post`,
            body: comment,
            badge: 3,
            data: pushObj,



        };

        // POST adds a random id to the object sent
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(push),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                  returned from server\n
                  json.data= ${JSON.stringify(json.data)}`);

                } else {
                    alert('err json');
                }
            });
    }

    const askIfWantToDelete = (postId) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    onPress: () => { return null },
                    style: "cancel"
                },
                { text: "Delete", onPress: () => deletePost(postId) }
            ]
        );

    }

    const deletePost = async (postId) => {


        try {

            const res = await axios.delete(`https://proj.ruppin.ac.il/bgroup14/prod/api/post/deletepost/${postId}`)

            Toast.show({
                text: "Post deleted successfully!",
                type: "success",
                duration: 4000
            });

            props.refreshPage();

        } catch (error) {

            Alert.alert(
                "OOPS!",
                "Error occurred, try again.",
                [

                    { text: "OK" }
                ],
            );
        }

    }

    const updateCategoryStrength = async () => {

        try {
            const postInteractionUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/postIntercation/${userId}/${category}`
            //if this will fail (status !=200 ) it will catch the error in the error block
            const res = await axios.patch(postInteractionUrl);



        } catch (err) {

            console.log(err)
        }


    }

    const goToChat = () => {
        props.goToChatWithUser(currentMemberId, member_id);
        updateCategoryStrength();
    }

    const goToOtherUserProfile = () => {
        props.goToOtherUserProfile(member_id);
        updateCategoryStrength();
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }




    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.postContainer}>
                <View style={{ flexDirection: 'column' }} >
                    <Avatar

                        size='large'
                        avatarStyle=
                        {
                            goldenMember ? {

                                borderWidth: 1.5,
                                borderColor: '#FFD700',
                            } : null}
                        containerStyle={{ marginTop: windowHeight / 80, marginLeft: windowWidth / 60 }}
                        rounded
                        source={{
                            uri:
                                postCreatorImg,
                        }}
                    />

                </View>

                <View style={styles.postDetailsContainer}>
                    <View style={styles.userNameContainer}>

                        <TouchableOpacity onPress={() => goToOtherUserProfile()}>
                            <Text style={styles.userName}>{postCreatorName}</Text>

                        </TouchableOpacity>

                        {currentMemberId == member_id ? <TouchableOpacity onPress={() => askIfWantToDelete(postId)}>
                            <FontAwsome name='trash' size={16} style={{ marginLeft: windowWidth / 2.5, marginTop: 6 }} />
                        </TouchableOpacity> : null}


                    </View>
                    <Text style={styles.postText}>{text}</Text>
                    {!recurring ? <Text style={styles.postDateText}>At {dateLabel + ", "}{timeOfDay}</Text> : null}
                    {currentMemberId != member_id ? <Text style={styles.postCityName}>{cityName != "Zoom Meeting" ? "In " : null}{cityName} {postDistanceKM} </Text>

                        : <Text style={styles.postCityName}>{cityName != "Zoom Meeting" ? "In " : null}{cityName} </Text>
                    }

                </View>




            </View>
            {comments.length > 0 ? <TouchableOpacity style={styles.commentsContainer} onPress={() => props.showComments(comments)}>
                <Text>{comments.length} {commentsLabel}</Text>
            </TouchableOpacity> : null}
            <Divider style={{ height: 0.8 }} />
            {showCommentInput ?
                <View style={styles.commentContainer}>
                    <TextInput autoFocus={true} placeholder="Enter your comment here" multiline={true} style={styles.commentInput} numberOfLines={3} onChangeText={(text) => setComment(text)} />
                    <TouchableOpacity onPress={() => publishComment()}>
                        <FontAwsome name='send-o' color='#fff' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View> : null}

            <View style={styles.postBtnContainer}>


                {currentMemberId == member_id ? null : <TouchableOpacity onPress={() => goToChat()} style={styles.postBtn}>
                    <Ionicons name='chatbubbles-outline' size={25} color="gray" />
                    <Text style={styles.btnText}>Chat</Text>
                </TouchableOpacity >}
                <TouchableOpacity onPress={() => setShowCommentInput(!showCommentInput)} style={styles.postBtn}>
                    <FontAwsome name='commenting-o' size={25} color="gray" />
                    <Text style={styles.btnText}>Comment</Text>
                </TouchableOpacity >

            </View>
        </KeyboardAvoidingView>

    )
}

export default Post

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    postContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        maxHeight: windowHeight / 4,
        marginVertical: 10,


    },
    postDetailsContainer: {
        flex: 1,
        marginLeft: windowWidth / 20,
        marginTop: windowHeight / 80,
        maxWidth: windowWidth / 1.8,
        marginBottom: windowHeight / 60


    },
    userNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userName:
    {
        fontSize: 16,
        fontFamily: 'Inter_700Bold'
    },
    postText: {
        marginVertical: 5,
        fontFamily: 'Inter_400Regular'
    },
    postDateText: {
        marginVertical: windowHeight / 100,
        color: 'black'
    },
    postCityName: {
        color: 'blue',
        fontFamily: 'Ubuntu_400Regular'


    },
    postBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: windowWidth / 100,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: windowHeight / 100,

    },
    postBtn: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 10
    },
    btnText: { marginLeft: 5 },
    commentsContainer:
    {
        marginBottom: windowHeight / 100,
        marginRight: windowHeight / 100,
        alignItems: 'flex-end'
    },

    commentContainer: {
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        height: 60
    },
    commentInput: {
        maxWidth: '85%'
    }

})
