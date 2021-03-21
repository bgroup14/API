import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { getIconType } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Button } from 'react-native-elements';

import Post from '../components/Post';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MyOverlay from '../components/MyOverlay';







import MyLinearGradient from '../components/MyLinearGradient';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Divider } from 'react-native-elements';
import axios from 'axios';


import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FeedFilterScreen from './FeedFilterScreen';
import CommentsScreens from './CommentsScreens';





const HomeScreen = (props) => {
    const [posts, setPosts] = useState([]);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getallposts`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);

    useEffect(() => {
        if (commentsToShow.length > 0) {
            console.log(commentsToShow)
            setIsCommentsVisible(true)
        }


    }, [commentsToShow])



    useFocusEffect(
        React.useCallback(() => {
            fetchPosts()
            setNewComment(false)

        }, [newComment])
    )


    const fetchPosts = async () => {
        console.log("fetching posts data...");
        const res = await axios(postsFetchURL);
        console.log(res.data)
        setPosts(res.data)

    };

    const fetchFilteredPosts = async (filteredPostObj) => {
        console.log(filteredPostObj)
        setIsFilterVisble(false)

        // console.log("fetching posts data...");
        // const res = await axios(postsFetchURL);
        // console.log(res.data)
        // setPosts(res.data)

    };

    const filterByCategory = (categoryName) => {
        /// Filter posts by category name
    }

    let categories = [
        { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
        { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
        { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
        { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
        { label: 'General', value: 'General', icon: () => <MaterialIcons name="volunteer-activism" size={24} color="#000000" /> },
    ]



    // let userName = useSelector(state => state.auth.userName);
    let userName = useSelector(state => state.user.userName);
    const userId = useSelector(state => state.auth.userId);

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

    //goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}

    return (
        <KeyboardAvoidingView style={styles.container} >
            <MyOverlay isVisible={isFilterVisible} onBackdropPress={() => setIsFilterVisble(false)}  >
                <FeedFilterScreen closeFilter={() => setIsFilterVisble(false)} sendFilteredObj={(filteredPostObj => fetchFilteredPosts(filteredPostObj))} />
            </MyOverlay>
            <MyOverlay isVisible={isCommentsVisible} onBackdropPress={() => toggleCommentsScreen()}   >
                <CommentsScreens comments={commentsToShow} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />
            </MyOverlay>
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
                {/* <View style={styles.categoryContainer}>
                    <Text>Category dropdown</Text>
                </View> */}
                <View style={styles.selectCategoryContainer}>
                    <DropDownPicker
                        placeholder="Select Category"
                        items={categories}
                        containerStyle={styles.dropDownContainer}
                        itemStyle={{

                            justifyContent: 'flex-start', marginTop: 1, borderBottomWidth: 0, borderColor: 'black', paddingBottom: 20
                        }}
                        onChangeItem={item => filterByCategory(item.value)}
                    // onChangeItem={item => setPostCategory(item.value)}
                    />
                    <TouchableOpacity onPress={() => setIsFilterVisble(true)} style={{ flex: 1 }}>

                        <Icon name='filter' size={26} style={styles.filterICon} />
                    </TouchableOpacity>
                </View>
                {/* <Divider /> */}


                <ScrollView style={styles.postsContainer}>

                    {/* {postsArray.map((post) => {
                        return <Post post={post} key={post.id} />
                        // return <Post text={post.text} cityName={post.cityName} />
                    })} */}
                    {posts.map((post) => {
                        return <Post post={post} key={post.postId} showComments={(comments) => showComments(comments)}
                            refreshPage={() => setNewComment(true)} currentMemberId={userId}
                            goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />

                        // return <Post text={post.text} cityName={post.cityName} />
                    })}



                    {/* <FlatList
                        keyExtractor={(item, index) => item.id.toString()}
                        data={posts}
                        renderItem={({ item }) => (
                            <Post />
                        )}



                    /> */}


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
    bellIcon: {
        color: '#ffffff',
        fontSize: 24
    },
    selectCategoryContainer:
    {
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginBottom: 60,
        width: '100%',
        // marginLeft: windowWidth / 50,
        borderRadius: 50
    }, dropDownContainer: {

        width: '85%',
        height: windowHeight / 15,

    },
    filterICon: { marginLeft: 30, marginTop: 15 },

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
