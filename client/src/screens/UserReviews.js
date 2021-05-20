import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import axios from 'axios';
import Review from '../components/Review';


const UserReviews = (props) => {
    let userId = props.userId
    const [reviews, setReviews] = useState([]);
    const fetchReviewsUrl = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getallreviews/${userId}`


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(fetchReviewsUrl);
                setReviews(res.data);

            } catch (error) {
                console.log(error)
            }
        }

        fetchReviews();
    }, [])


    return (
        <ScrollView  >
            {reviews.map((review) => {
                return <Review review={review} key={review.id} goToOtherUserProfile={(member_id) => props.goToOtherUserProfile(member_id)} />

            })}
        </ScrollView>
    )
}

export default UserReviews

const styles = StyleSheet.create({})
