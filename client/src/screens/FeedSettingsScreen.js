import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CheckBox } from 'react-native-elements'
import HorizontalLine from '../components/HorizontalLine';




const FeedSettingsScreen = (props) => {
  const [userType, setUserType] = useState();
  const [postsLocation, setPostsLocation] = useState();
  const [fromGender, setFromGender] = useState();
  const [participantAgeRange, setParticipantAgeRange] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [profileSetupDetails, setProfileSetupDetails] = useState({});
  const [hobbies, setHobbies] = useState({});
  const [imageWasUploaded, setImageWasUploaded] = useState(false);

  const [uploadedPicture, setUploadedPicture] = useState({});
  const uplodedPicPath = 'http://proj.ruppin.ac.il/bgroup14/prod/Userimage/';




  useEffect(() => {
    getDataFromAS();


  }, [])
  useEffect(() => {
    if (userType != undefined && !imageWasUploaded) {
      imageUpload();
      setImageWasUploaded(true)
    }
  }, [userType])


  const getDataFromAS = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up name from signup screen page: " + jsonObj.fullName)
      }
      let jsonValueTwo = await AsyncStorage.getItem('profileSetupDetails')
      let jsonObjTwo = jsonValueTwo != null ? JSON.parse(jsonValueTwo) : null;
      if (jsonObjTwo != null) {
        setProfileSetupDetails(jsonObjTwo)
        console.log("profile setup image is : " + jsonObjTwo.image)
      }
      let jsonValueThree = await AsyncStorage.getItem('hobbies')
      let jsonObjThree = jsonValueThree != null ? JSON.parse(jsonValueThree) : null;
      if (jsonObjThree != null) {
        setHobbies(jsonObjThree)
      }



    } catch (e) {
      console.log("error in feed setting page !!")
      console.log(e.message)
      // error reading value
    }
  }
  const check = () => {
    // console.log("photo after uploading is  " + uploadedPicture.uri)
    // console.log("unix date is: " + profileSetupDetails.date)
    // console.log("gender is: " + profileSetupDetails.gender)
    // console.log("profie image path is : " + profileSetupDetails.myImage)
    // console.log(signUpDetails.fullName)
    // console.log("hobbies length is " + hobbies.length)

  }



  const imageUpload = () => {
    //alert(1);
    let urlAPI = "http://proj.ruppin.ac.il/bgroup14/prod/uploadpicture";
    let imgName = 'imgFromCamera.jpg';
    let imgUri = profileSetupDetails.image
    let dataI = new FormData();
    dataI.append('image', {
      uri: imgUri,
      name: imgName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: dataI,
    };

    fetch(urlAPI, config)
      .then((res) => {
        console.log('res.status=', res.status);
        if (res.status == 201) {
          return res.json();
        }
        else {
          console.log('error uploding res is  ...' + res.statusText + res.message);
          return "err";
        }
      })
      .then((responseData) => {
        console.log(responseData);
        if (responseData != "err") {
          let picNameWOExt = imgName.substring(0, imgName.indexOf("."));
          let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt), responseData.indexOf(".jpg") + 4);
          setUploadedPicture({ uri: uplodedPicPath + imageNameWithGUID })


          // this.setState({
          //   uplodedPicUri: { uri: this.uplodedPicPath + imageNameWithGUID },
          // });
          console.log("img uploaded successfully!");
          // return uplodedPicPath + imageNameWithGUID;
        }
        else {
          console.log('error uploding ...');
          alert('error uploding ...');
        }
      })
      .catch(err => {
        alert('err upload= ' + err);
      });
  }

  // const storeFeedSettingsToAs = async () => {

  //   let value = {
  //     userType,
  //     postsLocation,
  //     fromGender,
  //    participantAgeRange
  //   }

  //   /// change this to send it to the server insead of the asyc storage
  //   try {
  //     const jsonValue = JSON.stringify(value)
  //     await AsyncStorage.setItem('feedSettings', jsonValue)
  //     console.log("Feed settings saved to AS!")
  //   } catch (e) {
  //     // saving error
  //     console.log(e)
  //   }
  // }

  const completeSignUp = () => {


    /// here i will check if profileSetupDetails.image includes 'https'
    /// if it inculeds  we wont upload the picture and just continue with the function below
    /// if it dosent inculeds 'https' we upload the picture to the server and then set the res url to profileSetupDetails.image and then send it to db with the function below
    // if (!profileSetupDetails.image.includes("https")) {

    const feedSettings = {

      memberType: userType,
      postsLocation,
      fromGender,
      participantAgeRange
    }
    if (checkIfFormIsFilled(feedSettings)) {
      Alert.alert(
        "",
        "Please fill the entire form",
        [
          { text: "OK" }
        ],
      );
      return null
    }




    profileSetupDetails.image = uploadedPicture.uri;

    //console.log(signUpDetails)
    let fullSignUpDetails = {
      ...signUpDetails,
      ...profileSetupDetails,

    }
    console.log(fullSignUpDetails)
    /// now send fullSignUpDetails to the server 


  }
  const checkIfFormIsFilled = (obj) => {


    for (x in obj) {

      if (obj[x] === null || obj[x] === undefined) {
        return true;
      }
    }
    return false;


  }
  return (
    <ScrollView >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Feed Settings</Text>
        </View>
        <Text style={styles.feedSettingsFilterText}>Do you</Text>

        <View kstyle={styles.radioBtnContainer}>

          <CheckBox containerStyle={styles.CheckBox}
            title='Want To Help'
            checked={userType == 'Want To Help'}
            onPress={() => userType != 'Want To Help' ? setUserType('Want To Help') : setUserType(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='Need Help'
            checked={userType == 'Need Help'}
            onPress={() => userType != 'Need Help' ? setUserType('Need Help') : setUserType(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='Both'
            checked={userType == 'Both'}
            onPress={() => userType != 'Both' ? setUserType('Both') : setUserType(null)}

          />
        </View>
        <HorizontalLine />



        <Text style={styles.feedSettingsFilterText}>Post's location</Text>


        <View style={styles.radioBtnContainer}>

          <CheckBox containerStyle={styles.CheckBox}
            title='My Area'
            checked={postsLocation == 'My Area'}
            onPress={() => postsLocation != 'My Area' ? setPostsLocation('My Area') : setPostsLocation(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='30KM'
            checked={postsLocation == '30KM'}
            onPress={() => postsLocation != '30KM' ? setPostsLocation('30KM') : setPostsLocation(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='All Country'
            checked={postsLocation == 'All Country'}
            onPress={() => postsLocation != 'All Country' ? setPostsLocation('All Country') : setPostsLocation(null)}

          />
        </View>
        <HorizontalLine />

        <Text style={styles.feedSettingsFilterText}>Participant gender</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox containerStyle={styles.CheckBox}
            title='Man'
            checked={fromGender == 'Man'}
            onPress={() => fromGender != 'Man' ? setFromGender('Man') : setFromGender(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='Woman'
            checked={fromGender == 'Woman'}
            onPress={() => fromGender != 'Woman' ? setFromGender('Woman') : setFromGender(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title="Both"
            checked={fromGender == "Both"}
            onPress={() => fromGender != "Both" ? setFromGender("Both") : setFromGender(null)}

          />

        </View>
        <HorizontalLine />
        <Text style={styles.feedSettingsFilterText}>Participant age</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox containerStyle={styles.CheckBox}
            title='16-30'
            checked={participantAgeRange == "16 30"}
            onPress={() => participantAgeRange != "16 30" ? setParticipantAgeRange("16 30") : setParticipantAgeRange(null)}

          />

          <CheckBox containerStyle={styles.CheckBox}
            title='30-50'
            checked={participantAgeRange == "30-50"}
            onPress={() => participantAgeRange != "30-50" ? setParticipantAgeRange("30-50") : setParticipantAgeRange(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='50 +'
            checked={participantAgeRange == "50 99"}
            onPress={() => participantAgeRange != "50 99" ? setParticipantAgeRange("50 99") : setParticipantAgeRange(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title="Dosen't Matter"
            checked={participantAgeRange == "16 99"}
            onPress={() => participantAgeRange != "16 99" ? setParticipantAgeRange("16 99") : setParticipantAgeRange(null)}

          />
        </View>


        <FormButton
          buttonTitle="Complete Sign Up"
          onPress={() => completeSignUp()}

        //  onPress={() => register(email, password)} go to - profile setup
        />

        <Button title='check data from as'
          onPress={() => check()}
        />
        <Button title='Upload image'
          onPress={() => imageUpload()}
        />


        {/* 
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => props.navigation.navigate('SignIn')}>
          <Text style={styles.navButtonText}>Have an account? Sign In</Text>
        </TouchableOpacity> */}
      </ View>
    </ScrollView >
  );
};

export default FeedSettingsScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f9fafd',
    flex: 1,
    // alignItems: 'center',
    padding: 20,

  },
  radioBtnContainer: {
    // flexDirection: 'row',
    //flexWrap: 'wrap',
    // borderWidth: 1,
    //   borderColor: '#ccc',
    //justifyContent: 'flex-start',
    marginVertical: 15,
    width: '100%',
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,


  }
  ,
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    margin: 40
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //  fontFamily: 'Lato-Regular',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  imageContainer: {
    padding: 20
  },
  CheckBox:
  {
    //   borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
    //  borderColor: '#fff'
    borderWidth: 0
  },
  feedSettingsFilterText: {
    fontSize: 20,
    fontStyle: 'italic'
  },
  headerContainer:
  {
    flex: 1,
    alignItems: 'center'
  }


});
