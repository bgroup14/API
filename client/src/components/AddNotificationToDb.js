import axios from 'axios';

const AddNotificationToDb = async (notificationObj) => {


    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const notificationBody = JSON.stringify(notificationObj)

    console.log("Will add notification with body: " + notificationBody);
    const addNotificationUrl = 'https://proj.ruppin.ac.il/bgroup14/prod/api/member/addNotification';

    try {

        const res = await axios.post(addNotificationUrl, notificationBody, config);

    }
    catch (error) {
        console.log("error in adding notification to db")
    }
}
export default AddNotificationToDb
