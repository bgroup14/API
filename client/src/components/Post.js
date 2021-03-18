import { text } from '@fortawesome/fontawesome-svg-core';
import React from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Post = (props) => {
    const { id, text, cityName, recurring, dateLabel, timeOfDay, postCreatorImg, postCreatorName } = props.post;

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
                <TouchableOpacity onPress={() => alert(1)} style={styles.postBtn}>
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

    // userImageContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     alignItems: 'center'

    // },
    userImage: {
        // width: 100,
        // height: 100

    }

})
