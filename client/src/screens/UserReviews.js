import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import axios from 'axios';
import Review from '../components/Review';


const UserReviews = (props) => {
    let userId = props.userId
    const [reviews, setReviews] = useState([]);
    const fetchReviewsUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getallreviews/${userId}`


    useEffect(() => {
        const fetchReviews = async () => {
            //axios review func
            try {
                const res = await axios.get(fetchReviewsUrl);
                console.log(res.data)
                setReviews(res.data);

            } catch (error) {
                console.log(error)
            }
        }

        fetchReviews();
    }, [])


    return (
        <ScrollView  >
            {/* {console.log(chatRooms)} */}
            {reviews.map((review) => {
                // console.log("chat room is: " + chatRoom)
                return <Review review={review} key={review.id} goToOtherUserProfile={(member_id) => props.goToOtherUserProfile(member_id)} />
                // return <User user={user} key={user.memberId} goToOtherUserProfile={(member_id) => goToOtherUserProfile(member_id)} />

            })}
        </ScrollView>
    )
}

export default UserReviews

const styles = StyleSheet.create({})
