import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { Avatar, } from 'react-native-elements';
// import ReviewTextArea from '../components/ReviewTextArea'

import { Rating, AirbnbRating, Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Toast } from "native-base";
import * as Font from "expo-font";










const Review = (props) => {

    const { otherMemberImage, otherMemberId, otherMemberName, } = props.reviewObj
    let userId = useSelector(state => state.auth.userId);

    const [rating, setRating] = useState(3);
    const [reviewText, setReviewText] = useState(null);





    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

            })
            loadFonts();
        }

    }, [])


    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        setRating(rating)
    }
    const reviewTextHandler = text => {
        // console.log(text)
        setReviewText(text)
    }


    const addMemberInteraction = async (type) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let body = {
            memberId: userId,
            otherMemberId: otherMemberId,
            type: type,
        }
        const addMemberInteractionUrl = 'https://proj.ruppin.ac.il/bgroup14/prod/api/member/addInteractionMember'
        try {
            const res = await axios.post(addMemberInteractionUrl, body, config);
            console.log(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const submitReview = async () => {
        console.log(rating)
        console.log(reviewText)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let review = {
            fromMemberId: userId,
            memberId: otherMemberId,
            text: reviewText,
            stars: rating
        }

        let type = `Review ${rating}`;
        addMemberInteraction(type)




        const body = JSON.stringify(review)
        console.log("Will publish review with body: " + body)



        const addReviewUrl = "https://proj.ruppin.ac.il/bgroup14/prod/api/member/addreview";


        try {
            const res = await axios.post(addReviewUrl, body, config);
            console.log(res.data);
            // Deltete meeting notificTIION

            props.closeReview();
            // Deltete meeting notificTIION


        } catch (error) {
            //ALERT ERROR
        }


    }




    return (
        <KeyboardAvoidingView>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Volunteering Review</Text>
            </View>
            <Divider style={{ marginTop: windowHeight / 50 }} />
            <View style={styles.profileImageContainer}>
                <Avatar
                    size='large'
                    //   containerStyle={{ marginTop: 10 }}
                    rounded
                    source={{
                        uri:
                            otherMemberImage,
                    }}
                />
            </View>
            <View style={styles.nameContainer}>
                <View >
                    <Text style={styles.name}>Rate the meeting with</Text>
                    <Text style={styles.name}>{otherMemberName}</Text>

                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                <AirbnbRating onFinishRating={ratingCompleted} />

                <View style={styles.inputContainer}>

                    <TextInput
                        // value={labelValue}
                        style={styles.input}
                        multiline={true}
                        placeholder="Additional Comments..."
                        placeholderTextColor="black"
                        maxLength={500}
                        onChangeText={(text) => reviewTextHandler(text)}
                    />
                </View>

                {/* <ReviewTextArea /> */}
            </View>
            <View style={styles.btnContainer}>
                <Button style={{ width: windowWidth / 2.7 }} labelStyle={{ color: '#3b5998' }} mode='outlined' uppercase={false} onPress={() => console.log("object")}>
                    No Thanks</Button>
                <Button style={{ width: windowWidth / 2.7, backgroundColor: '#3b5998' }} labelStyle={{ color: '#fff' }} mode='contained' uppercase={false} onPress={() => submitReview()}>
                    Submit Review</Button>
            </View>

        </KeyboardAvoidingView>
    )
}

export default Review

const styles = StyleSheet.create({
    header: {
        fontSize: 24,

        color: '#3b5998'
    },
    headerContainer: {
        // flexDirection: 'row',
        marginTop: windowHeight / 50,
        alignItems: 'center',
        // justifyContent: 'center',
        // alignContent: 'center'
    },
    profileImageContainer: {
        //  flex: 1,
        marginTop: windowHeight / 30,
        alignItems: 'center',
        //justifyContent: 'flex-end'

    },
    nameContainer: {
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        marginTop: windowHeight / 60
    },
    name: {
        fontSize: 18,
        textAlign: 'center'
        // fontSize: 20,
        // justifyContent: 'center',
        // alignContent: 'center',
        // alignItems: 'center'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // alignItems: 'flex-end',
        marginVertical: windowHeight / 30
    },
    inputContainer: {

        width: windowWidth / 1.2,
        height: windowHeight / 8,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#e6e6e6',
        marginTop: windowHeight / 40,
        borderRadius: 10
    },
    input: {

        padding: 10,
        fontSize: 16,

    },

})
