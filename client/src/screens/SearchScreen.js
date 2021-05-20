import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import MyOverlay from '../components/MyOverlay';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';
import CommentsScreens from './CommentsScreens';
import User from '../components/User';
import { Appbar, Searchbar } from 'react-native-paper';

const SearchScreen = (props) => {
    const [searchWord, setSearchWord] = useState("");
    const [postContainerHeight, setPostContainerHeight] = useState(windowHeight / 10);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([])
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getpostsbysearchword/`
    const usersFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/GetMembersBySearchWord/`
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [hasBeenFetched, setHasBeenFetched] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 0) {
            fetchUserPosts()
            fetchUsers()
        }
        else {
            setPosts([])
            setUsers([])
            setPostContainerHeight(0)


        }
        if (commentsToShow.length > 0) {
            setIsCommentsVisible(true)
        }


    }, [commentsToShow, searchQuery])



    useFocusEffect(
        React.useCallback(() => {
            setSearchWord("")
            setSearchQuery('')
            setNewComment(false)
        }, [])
    )

    const fetchUserPosts = async () => {
        setHasBeenFetched(false)
        try {
            const res = await axios(`${postsFetchURL}${searchQuery}`);
            setPosts(res.data);
            setHasBeenFetched(true)

        } catch (error) {
            console.log(error)
        }

    }

    const fetchUsers = async () => {
        try {
            const res = await axios(`${usersFetchURL}${searchQuery}`);
            setUsers(res.data);

        } catch (error) {
            console.log(error)
            console.log("error!")
        }

    }



    let userId = useSelector(state => state.auth.userId);




    let userName = useSelector(state => state.user.userName);

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



    let postsHeader = posts.length > 0 && users.length > 0 ? <Text style={styles.usersText}>Posts:</Text> : null
    let usersHeader = users.length > 0 && posts.length > 0 ? <Text style={styles.usersText}>Users:</Text> : null




    return (
        <KeyboardAvoidingView style={styles.container} >
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}  >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>
            <Appbar.Header style={{ backgroundColor: '#3b5998', marginHorizontal: windowWidth / 100 }} >

                <Appbar.Content title="Search" />

            </Appbar.Header>
            <Searchbar
                placeholder="Search for users & posts"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />




            <View style={styles.inner}>

                {users.length == 0 && posts.length == 0 && searchQuery != '' && searchQuery.length > 1 && hasBeenFetched ?

                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/search.png')}
                            style={styles.logo}
                        />
                        <View style={{ marginTop: windowHeight / 60, alignItems: 'center' }}>

                            <Text style={{ fontSize: 16 }}>Sorry, we didn't find any results</Text>
                            <Text style={{ fontSize: 16 }} >matching this search.</Text>
                        </View></View> :
                    <ScrollView  >
                        {usersHeader}
                        {users.map((user) => {
                            return <User user={user} key={user.memberId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
                        })}
                        {
                            users.length > 0 ?
                                <View style={{ marginTop: 40 }}>
                                </View> : null
                        }
                        {postsHeader}
                        {posts.map((post) => {
                            return <Post post={post} key={post.postId} showComments={(comments) => showComments(comments)} refreshPage={() => setNewComment(true)} currentMemberId={userId}
                                goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
                        })}
                    </ScrollView>
                }






            </View>
        </KeyboardAvoidingView >
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    inner: {
        padding: windowHeight / 90,
        //  minHeight: windowHeight / 1.5,

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
        // marginTop: windowHeight / 120

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
    postsContainer: {
        //flex: 1,
        minHeight: windowHeight / 2.1
    },
    usersContainer: {

        flex: 2,
        minHeight: windowHeight / 4
        // alignItems: 'center',
        //  padding: 10
    },
    usersText: {
        textDecorationLine: 'underline',
        marginTop: windowHeight / 70,
        marginBottom: windowHeight / 100,
        fontSize: 18
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
    },
    logo: {
        height: 100,
        width: 100,
        // marginBottom: windowHeight / 26.92121,
    },
    logoContainer: {
        marginTop: windowHeight / 4,
        justifyContent: 'center',
        alignItems: 'center',
        //     marginBottom: windowHeight / 80

    },





})
