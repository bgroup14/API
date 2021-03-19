import { text } from '@fortawesome/fontawesome-svg-core';
import React, { useState } from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowHeight } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';



const Post = (props) => {
    const { postId, text, cityName, recurring, dateLabel, timeOfDay, postCreatorImg, postCreatorName, comments } = props.post;
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState(null);
    let userId = useSelector(state => state.auth.userId);



    // let comments = [
    //     {
    //         commentingMemberName: 'LeBron James',
    //         commentingMemberImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9wl5WIvrkZ-VoZn2HuReBMOYxCCtZxSQTdQ&usqp=CAU',
    //         text: 'Had such a great time with you Alan!',
    //         id: 1
    //     },
    //     {
    //         commentingMemberName: 'Kendell Jenner',
    //         commentingMemberImage: 'http://www.gstatic.com/tv/thumb/persons/532957/532957_v9_bb.jpg',
    //         text: 'Alan was so cute and handsome',
    //         id: 2
    //     },
    //     {
    //         commentingMemberName: 'Dolev Tamir',
    //         commentingMemberImage: 'http://www.gstatic.com/tv/thumb/persons/532957/532957_v9_bb.jpg',
    //         text: 'Pleasure to collaborate with you',
    //         id: 3
    //     }

    // ]

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
                    // { text: "OK", onPress: () => props.navigation.navigate('Home') }

                ],
                setShowCommentInput(false)
            );

            // console.log("res data (payload is:)")

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

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.postContainer}>
                {/* <View style={styles.userImageContainer}> */}
                <Avatar

                    size='large'
                    // avatarStyle={{ height: 59, }}
                    containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            postCreatorImg,
                    }}
                />
                <View style={styles.postDetailsContainer}>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userName}>{postCreatorName}</Text>

                    </View>
                    <Text style={styles.postText}>{text}</Text>
                    {!recurring ? <Text style={styles.postDateText}>At {dateLabel + " "}{timeOfDay}</Text> : null}
                    <Text style={styles.postCityName}>{cityName != "Zoom Meeting" ? "In " : null}{cityName}</Text>

                </View>



                {/* </View> */}

            </View>
            <View style={styles.postBtnContainer}>
                <TouchableOpacity onPress={() => setShowCommentInput(!showCommentInput)} style={styles.postBtn}>
                    <FontAwsome name='commenting-o' size={25} color="gray" />
                    <Text style={styles.btnText}>Comment</Text>
                </TouchableOpacity >

                <TouchableOpacity style={styles.postBtn}>
                    <FontAwsome name='heart-o' size={25} color="gray" />
                    <Text style={styles.btnText}>Like</Text>
                </TouchableOpacity >
                <TouchableOpacity style={styles.postBtn}>
                    <Ionicons name='chatbubbles-outline' size={25} color="gray" />
                    <Text style={styles.btnText}>Chat</Text>
                </TouchableOpacity >
            </View>
            {showCommentInput ?
                <View style={styles.commentContainer}>
                    <TextInput placeholder="Enter your comment here" multiline={true} style={styles.commentInput} numberOfLines={3} onChangeText={(text) => setComment(text)} />
                    <TouchableOpacity onPress={() => publishComment()}>
                        <FontAwsome name='send-o' color='#fff' style={{ marginTop: windowHeight / 50, marginRight: windowHeight / 50 }} size={22} />
                    </TouchableOpacity>
                </View> : null}
            <TouchableOpacity style={styles.commentsContainer} onPress={() => props.showComments(comments)}>
                <Text>{comments.length} Comments</Text>
            </TouchableOpacity>


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
        //  flex: 1,
        //justifyContent: 'flex-start',
        //justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 10,
        maxWidth: 200,


        // alignItems: 'center'

    },
    userNameContainer: {
        //margin: 2
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
    commentsContainer: { marginTop: 10, marginBottom: 10, alignItems: 'flex-end' },

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
        // flex: 1,
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
