import { text } from '@fortawesome/fontawesome-svg-core';
import React, { useState } from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';



const Post = (props) => {
    const { postId, text, cityName, recurring, dateLabel, timeOfDay, postCreatorImg, postCreatorName, comments, member_id } = props.post;
    let currentMemberId = props.currentMemberId;
    //  console.log("current member id is: " + currentMemberId)
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState(null);
    let userId = useSelector(state => state.auth.userId);
    let commentsLabel = comments.length > 1 ? 'Comments' : 'Comment';





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
        console.log("Will publish comment with body: " + body);



        try {
            //if this will fail (status !=200 ) it will catch the error in the error block
            const res = await axios.post("https://proj.ruppin.ac.il/bgroup14/prod/api/post/publishcomment", body, config);
            console.log(res);
            Alert.alert(
                "Comment Publish",
                "Comment published successfully. ",
                [
                    { text: "OK", onPress: () => props.refreshPage() }

                ],
                setShowCommentInput(false)
            );


        } catch (err) {

            Alert.alert(
                "OOPS!",
                "Error occurred, try again.",
                [

                    { text: "OK" }
                ],
            );


        }

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
            Alert.alert(
                "Post Deleted!",
                "Post deleted successfully.",
                [

                    { text: "OK" }
                ],
            );
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



        //19
        // console.log(postId)



        //AT THE END ACTIVATE PROPS.refreshPage
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.postContainer}>
                <Avatar

                    size='large'
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            postCreatorImg,
                    }}
                />
                <View style={styles.postDetailsContainer}>
                    <View style={styles.userNameContainer}>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate('OtherUserProfileScreen', {
                            userId: member_id
                        })}> */}
                        <TouchableOpacity onPress={() => props.goToOtherUserProfile(member_id)}>
                            <Text style={styles.userName}>{postCreatorName}</Text>

                        </TouchableOpacity>

                        {currentMemberId == member_id ? <TouchableOpacity onPress={() => askIfWantToDelete(postId)}>
                            <FontAwsome name='trash' size={16} style={{ marginLeft: windowWidth / 2.5, marginTop: 6 }} />
                        </TouchableOpacity> : null}


                    </View>
                    <Text style={styles.postText}>{text}</Text>
                    {!recurring ? <Text style={styles.postDateText}>At {dateLabel + ", "}{timeOfDay}</Text> : null}
                    <Text style={styles.postCityName}>{cityName != "Zoom Meeting" ? "In " : null}{cityName}</Text>

                </View>



                {/* </View> */}

            </View>
            <View style={styles.postBtnContainer}>
                <TouchableOpacity onPress={() => setShowCommentInput(!showCommentInput)} style={styles.postBtn}>
                    <FontAwsome name='commenting-o' size={25} color="gray" />
                    <Text style={styles.btnText}>Comment</Text>
                </TouchableOpacity >

                {/* <TouchableOpacity style={styles.postBtn}>
                    <FontAwsome name='heart-o' size={25} color="gray" />
                    <Text style={styles.btnText}>Like</Text>
                </TouchableOpacity > */}
                { }
                {currentMemberId == member_id ? null : <TouchableOpacity onPress={() => props.goToChatWithUser(currentMemberId, member_id)} style={styles.postBtn}>
                    <Ionicons name='chatbubbles-outline' size={25} color="gray" />
                    <Text style={styles.btnText}>Chat</Text>
                </TouchableOpacity >}

            </View>
            {showCommentInput ?
                <View style={styles.commentContainer}>
                    <TextInput autoFocus={true} placeholder="Enter your comment here" multiline={true} style={styles.commentInput} numberOfLines={3} onChangeText={(text) => setComment(text)} />
                    <TouchableOpacity onPress={() => publishComment()}>
                        <FontAwsome name='send-o' color='#fff' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View> : null}
            {comments.length > 0 ? <TouchableOpacity style={styles.commentsContainer} onPress={() => props.showComments(comments)}>
                <Text>{comments.length} {commentsLabel}</Text>
            </TouchableOpacity> : null}



            <Divider style={{ height: 1.5 }} />


        </KeyboardAvoidingView>

    )
}

export default Post

const styles = StyleSheet.create({

    container: {
        marginVertical: 10,
        flex: 1,
        //  flexDirection: 'row',
        // justifyContent: 'flex-end',
        //  alignItems: 'flex-start'
    },
    postContainer: {
        flex: 1,
        flexDirection: 'row',
        //  marginVertical: 1,
        alignItems: 'flex-start',
        maxHeight: 100

    },
    postDetailsContainer: {
        flex: 1,
        //justifyContent: 'flex-start',
        //justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 10,
        maxWidth: windowWidth / 1.8,


        // alignItems: 'center'

    },
    userNameContainer: {
        //margin: 2
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userName:
    {
        fontSize: 16,
        fontWeight: 'bold'
    },
    postText: {
        // fontSize: 14
    },
    postDateText: {
        // color: 'red'
        color: 'black'
    },
    postCityName: {
        color: 'blue'

    },
    postBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 5,
        marginTop: 10

    },
    postBtn: {
        //  flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 10
    },
    btnText: { marginLeft: 5 },
    commentsContainer:
    {
        //marginTop: 1,
        marginBottom: 4,
        alignItems: 'flex-end'
    },

    // userImageContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     alignItems: 'center'

    // },
    userImage: {
        // width: 100,
        // height: 100

    }, commentContainer: {
        // flex 1,
        backgroundColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        height: 60
        // justifyContent: 'flex-start'
    },
    commentInput: {
        maxWidth: '85%'
    }

})
