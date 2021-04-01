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
    const userId = useSelector(state => state.auth.userId);
    const postsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/post/getFilteredPosts/${userId}`
    const [isFilterVisible, setIsFilterVisble] = useState(false);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const [categoryNameToSend, setCategoryameToSend] = useState(null);
    const [postsFilteredObj, setPostsFilteredObj] = useState(null);
    const [restartComponent, setRestartComponent] = useState(1);
    const [categoriesToShow, setCategoriesToShow] = useState([]);


    useEffect(() => {
        if (commentsToShow.length > 0) {
            setIsCommentsVisible(true)
        }


    }, [commentsToShow, posts])



    useFocusEffect(
        React.useCallback(() => {

            setRestartComponent(Date.now)
            let categories = [
                { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
                { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
                { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
                { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
                { label: 'General', value: 'General', icon: () => <MaterialIcons name="volunteer-activism" size={24} color="#000000" /> },
            ]
            setCategoriesToShow(categories)
            setPostsFilteredObj(null)

            fetchPosts(postsFilteredObj)
            setNewComment(false)

        }, [newComment])
    )


    const fetchPosts = async (filterObj) => {



        if (filterObj == null) {
            try {

                console.log(userId)
                const res = await axios.post(postsFetchURL);

                setPosts(res.data)

            } catch (err) {
                console.log("error in fetching post")
                console.log(err.message)
            }

        }

        else {
            let objectLength = Object.keys(filterObj).length;
            var filterdObjToSend;
            if (objectLength == 1) {
                filterdObjToSend = {
                    ...filterObj,
                    ...postsFilteredObj
                }
            }
            else {
                filterdObjToSend = {
                    ...filterObj
                }
            }

            console.log("not empty")
            const body = JSON.stringify(filterdObjToSend)
            console.log("body that will be send to filter post is: " + body)
            try {

                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                const res = await axios.post(postsFetchURL, body, config);

                setPosts(res.data)

            } catch (err) {
                console.log(err)
            }
        }

    }


    const fetchFilteredPosts = async (filteredPostObj) => {
        let objToSend = {
            ...filteredPostObj,
            categoryName: categoryNameToSend
        }
        fetchPosts(objToSend)

        //In case we go to anoher screen so useFocus will be activated and will dend this obj to the server
        setPostsFilteredObj(filteredPostObj);
        let body = JSON.stringify(objToSend)
        console.log(body)



        setIsFilterVisble(false)


    };

    const filterByCategory = (categoryName) => {
        let category = {
            categoryName
        }
        setCategoryameToSend(categoryName);
        fetchPosts(category)




    }

    let categories = [
        // { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
        { label: 'Sport', value: 'Sport', icon: () => <FontAwsome5 name="running" size={22} color="#000000" /> },
        { label: 'Study', value: 'Study', icon: () => <Icon name="book" size={24} color="#000000" /> },
        { label: 'Mental', value: 'Mental', icon: () => <Icon name="phone" size={24} color="#000000" /> },
        { label: 'Elder People', value: 'Elder', icon: () => <MaterialIcons name="elderly" size={24} color="#000000" /> },
        { label: 'General', value: 'General', icon: () => <MaterialIcons name="volunteer-activism" size={24} color="#000000" /> },
    ]



    // let userName = useSelector(state => state.auth.userName);
    let userName = useSelector(state => state.user.userName);


    ///DELETE THIS!
    //   console.log("user name fromn rerdux is:" + userName)
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

    const goToChatWithUser = async (currentMemberId, member_id) => {
        console.log(currentMemberId)
        console.log(member_id)
        const getChatRoomIdUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/chat/getChatRoomId/${currentMemberId}/${member_id}`


        try {

            console.log("Checking Room Id...")
            const res = await axios(getChatRoomIdUrl);
            // console.log(res.data);
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

    //goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}

    return (
        <KeyboardAvoidingView style={styles.container} key={restartComponent}>
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
                <View style={styles.selectCategoryContainer} >
                    <DropDownPicker
                        placeholder="Select Category"

                        //defaultValue={restartComponent}
                        items={categoriesToShow}
                        // items={categories}
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

                {posts.length > 0 ?
                    <ScrollView contentContainerStyle={styles.postsContainer}>
                        {posts.map((post) => {
                            return <Post post={post} key={post.postId} showComments={(comments) => showComments(comments)}
                                refreshPage={() => setNewComment(true)} currentMemberId={userId}
                                goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)}
                                goToChatWithUser={(currentMemberId, member_id) => goToChatWithUser(currentMemberId, member_id)} />
                        })}


                    </ScrollView> :
                    <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.3, marginTop: windowWidth / 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 18 }}>We couldn't find posts that matches your posts filter request</Text>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen') */}
                        <TouchableOpacity onPress={() => setIsFilterVisble(true)
                        }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to try again</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 20 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            <View>
                                <Text style={{ width: 50, textAlign: 'center', fontSize: 16 }}>OR</Text>
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        </View>
                        <View style={{ marginHorizontal: windowWidth / 14, maxWidth: windowWidth / 1.2 }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')
                            }><Text style={{ textAlign: 'center', fontSize: 18 }}>Click here to update your feed settings</Text></TouchableOpacity>
                        </View>
                    </View>}

                {posts.length <= 2 && posts.length != 0 ? <View style={{ marginHorizontal: windowWidth / 10, maxWidth: windowWidth / 1.2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>couldn't find what you're looking for?</Text>

                    <TouchableOpacity onPress={() => props.navigation.navigate('EditFeedSettingsScreen')}>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>Click here to update your feed settings</Text>
                    </TouchableOpacity>
                </View>
                    : null}

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
        //  flex: 1,
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

        justifyContent: 'flex-start'
        //    / flex: 1,
        //   minHeight: 140
        // justifyContent: '',
        //alignItems: 'center'
    },
    userGreetingText: {
        fontSize: 18
    }


})
