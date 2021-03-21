import React from 'react'
import { Fragment } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import Comment from '../components/Comment';


const CommentsScreens = (props) => {

    const goToOtherUserProfile = (member_id) => {
        alert(1)
        // props.goToOtherUserProfile(member_id)

    }
    return (
        <Fragment>
            <KeyboardAvoidingView style={styles.container} >

                <ScrollView style={styles.postsContainer}>
                    {props.comments.map((comment) => {
                        return <Comment comment={comment} key={comment.text} goToOtherUserProfile={(member_id) => props.goToOtherUserProfile(member_id)} />
                        // return <Comment post={post} key={post.postId} showComments={(comments) => showComments(comments)} />
                    })}

                </ScrollView>




            </KeyboardAvoidingView>
        </Fragment>
    )
}

export default CommentsScreens

const styles = StyleSheet.create({
    container: {
        // flex: 0.9,
        // minHeight: 900,
        height: windowHeight * 0.80,

    },
    postsContainer: {
        // flex: 0.
        // height: '100%'
    },


})
