import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

import Post from '../components/Post';




import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Divider } from 'react-native-elements';
import axios from 'axios';


import { SafeAreaView } from 'react-native';





const HomeScreen = (props) => {
    const [posts, setPosts] = useState([]);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getallposts`


    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        console.log("fetching posts data...");
        const res = await axios(postsFetchURL);
        console.log(res.data)
        setPosts(res.data)

    };



    // let userName = useSelector(state => state.auth.userName);
    let userName = useSelector(state => state.user.userName);
    ///DELETE THIS!
    console.log("user name fromn rerdux is:" + userName)
    if (userName === null || userName === undefined) {
        userName = 'Alan skverer'
    }
    let userFirstName = userName.split(" ")[0];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    userFirstName = capitalizeFirstLetter(userFirstName)

    const createGreeting = () => {
        const hours = new Date().getHours(); //To get the Current Hours)
        if (hours > 0 && hours <= 5) {
            return "Good night"
        }
        else if (hours > 5 && hours <= 12) {
            return "Good morning"

        }
        else if (hours > 12 && hours <= 18) {
            return "Good afternoon"

        }
        return "Good evening"


    }

    let greeting = createGreeting();
    let postsArray = [
        {
            id: 1,
            text: 'Im offering help in C# and React',
            cityName: 'Heaven',
            recurring: false


        },
        {
            id: 2,
            text: 'I will help you with your homework',
            cityName: 'Tel Aviv',
            recurring: true
        },
        {
            id: 3,
            text: 'adsfdsfsssdfdsfsdfdadsfdsfsssdfdsfsdfdadsfdsfsssdfdsfsdfdadsfdsfsssdfdsfsdfdadsfdsfsssdfdsfsdfdadsfdsfss',
            cityName: 'Tel Aviv'

        },
        {
            id: 4,
            text: 'adsfd!!!!!!!sfsdfdsfsdfd',
            cityName: 'Tel Aviv'

        },
        {
            id: 5,
            text: 'adfsdfd',
            cityName: 'Tel Aviv'

        },
        {
            id: 6,
            text: 'adsfdsfsdfdsfsdfd',
            cityName: 'Tel Aviv'

        },
        {
            id: 7,
            text: 'adsfdsfsdfdsfsdfd',
            cityName: 'Tel Aviv'

        },
        {
            id: 8,
            text: 'adsfdsfsdfdsfsdfd',
            cityName: 'Tel Aviv',

        },


    ]



    // const userId = useSelector(state => state.auth.userId);

    return (
        <KeyboardAvoidingView style={styles.container} >
            <View style={styles.inner}>
                <MyLinearGradient firstColor="#00c6fb" secondColor="#005bea" height={90} />
                {/* <MyLinearGradient firstColor="#f5f7fa" secondColor="#c3cfe2" height={80} /> */}


                <View style={styles.barContainer}><Text style={styles.barText}>Feed</Text>
                    <Icon
                        style={styles.bellIcon}
                        name='bell'
                        onPress={() => props.navigation.navigate('Notifications')}
                    />
                </View>
                <View style={styles.categoryContainer}>
                    <Text>Category dropdown</Text>
                </View>
                <Divider />


                <ScrollView style={styles.postsContainer}>

                    {/* {postsArray.map((post) => {
                        return <Post post={post} key={post.id} />
                        // return <Post text={post.text} cityName={post.cityName} />
                    })} */}
                    {posts.map((post) => {
                        return <Post post={post} key={post.postId} />
                        // return <Post text={post.text} cityName={post.cityName} />
                    })}

                    {/* <FlatList
                        keyExtractor={(item, index) => item.id.toString()}
                        data={postsArray}
                        renderItem={({ item }) => (
                            <Post />
                        )}



                    /> */}
                    {/* <Post />
                        <Post />
                        <Post />
                        <Post /> */}

                </ScrollView>

                {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}><Text>Heyy</Text>
                        <TextInput placeholder="what"></TextInput>
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}><Text>Heyy</Text>
                    </View> */}
            </View>
        </KeyboardAvoidingView >
    )
}

export default HomeScreen

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
    categoryContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 60,

    },

    barContainer: {
        // flex: 1,

        justifyContent: 'space-between',
        alignItems: 'flex-end',
        //  marginLeft: 30,
        marginTop: windowHeight / 80,
        flexDirection: 'row',
        paddingLeft: windowWidth / 100,
        paddingRight: windowWidth / 100,

    },
    barText: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 'bold',

    },
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    postsContainer: {
        //    / flex: 1,
        //   minHeight: 140
        // justifyContent: '',
        //alignItems: 'center'
    },
    userGreetingText: {
        fontSize: 18
    }


})
