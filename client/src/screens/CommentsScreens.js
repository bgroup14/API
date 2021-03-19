import React from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import Comment from '../components/Comment';


const CommentsScreens = (props) => {
    return (
        <KeyboardAvoidingView style={styles.container} >
            <View >
                <ScrollView style={styles.postsContainer}>
                    {props.comments.map((comment) => {
                        return <Comment comment={comment} key={comment.id} />
                        // return <Comment post={post} key={post.postId} showComments={(comments) => showComments(comments)} />
                    })}
                </ScrollView>





            </View>



        </KeyboardAvoidingView>
    )
}

export default CommentsScreens

const styles = StyleSheet.create({
    container: {
        //  flex: 1,
        // minHeight: 900,
        height: windowHeight * 0.95,

    },
    postsContainer: {
        //  flex: 1
        // height: '100%'
    }

})
