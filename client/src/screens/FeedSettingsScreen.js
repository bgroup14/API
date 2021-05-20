import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import FormButton from '../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import HorizontalLine from '../components/HorizontalLine';
import MyLinearGradient from '../components/MyLinearGradient';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../store/actions/auth';

const FeedSettingsScreen = () => {
  const [userType, setUserType] = useState();
  const [postsLocation, setPostsLocation] = useState();
  const [fromGender, setFromGender] = useState();
  const [participantAgeRange, setParticipantAgeRange] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [profileSetupDetails, setProfileSetupDetails] = useState({});
  const [hobbies, setHobbies] = useState([]);
  const [imageWasUploaded, setImageWasUploaded] = useState(false);
  const [uploadedPicture, setUploadedPicture] = useState({});
  const uplodedPicPath = 'http://proj.ruppin.ac.il/bgroup14/prod/Userimage/';
  const dispatch = useDispatch();

  useEffect(() => {
    getDataFromAS();


  }, [])
  useEffect(() => {
    if (userType != undefined && !imageWasUploaded && profileSetupDetails.image != undefined) {
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
      }
      let jsonValueTwo = await AsyncStorage.getItem('profileSetupDetails')
      let jsonObjTwo = jsonValueTwo != null ? JSON.parse(jsonValueTwo) : null;
      if (jsonObjTwo != null) {
        setProfileSetupDetails(jsonObjTwo)

      }
      let jsonValueThree = await AsyncStorage.getItem('hobbies')
      let jsonObjThree = jsonValueThree != null ? JSON.parse(jsonValueThree) : null;
      if (jsonObjThree != null) {
        setHobbies(jsonObjThree)
      }



    } catch (e) {

    }
  }

  const imageUpload = () => {

    let urlAPI = "http://proj.ruppin.ac.il/bgroup14/prod/uploadpicture";
    let imgName = signUpDetails.email + '_imgFromCamera.jpg';
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

        }
        else {
          alert('error uploding ...');
        }
      })
      .catch(err => {
        alert('err upload= ' + err);
      });
  }



  const completeSignUp = () => {

    const feedSettings = {

      memberType: userType,
      postLocation: postsLocation,
      participantGender: fromGender,
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

    profileSetupDetails.image = uploadedPicture.uri != undefined ? uploadedPicture.uri : null;

    let registerDetails = {
      email: signUpDetails.email,
      password: signUpDetails.password,
      fullName: signUpDetails.fullName,
      city: profileSetupDetails.city,
      occupation: profileSetupDetails.occupation,
      bio: profileSetupDetails.bio,
      gender: profileSetupDetails.gender,
      pictureUrl: profileSetupDetails.image,
      dateOfBirth: profileSetupDetails.date,
      feedSettings,
      hobbies
    }

    let fullSignUpDetails = {
      signUpDetails,
      profileSetupDetails,
      feedSettings,
      hobbies


    }
    clearAsyncStorage()
    dispatch(register(registerDetails));
  }



  const clearAsyncStorage = async () => {
    const keys = ['hobbies', 'signUpDetails', 'profileSetupDetails']
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      // remove error
    }

    console.log('AS cleard')
  }
  const checkIfFormIsFilled = (obj) => {


    for (const x in obj) {

      if (obj[x] === null || obj[x] === undefined) {
        return true;
      }
    }
    return false;


  }
  return (
    <ScrollView >
      <MyLinearGradient firstColor="#ffffff" secondColor="#e7f0fd" height={1500} />

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Feed Settings</Text>
        </View>
        <Text style={styles.feedSettingsFilterText}>Do you</Text>
        <View style={styles.radioBtnContainer}>
          <CheckBox containerStyle={styles.CheckBox}
            title='Give Help'
            checked={userType == 'Give Help'}
            onPress={() => userType != 'Give Help' ? setUserType('Give Help') : setUserType(null)}
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

        <Text style={styles.feedSettingsFilterText}>Volunteering location</Text>
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
            title="Dosen't Matter"
            checked={fromGender == "Dosen't Matter"}
            onPress={() => fromGender != "Dosen't Matter" ? setFromGender("Dosen't Matter") : setFromGender(null)}

          />

        </View>
        <HorizontalLine />
        <Text style={styles.feedSettingsFilterText}>Participant age</Text>
        <View style={styles.radioBtnContainer}>

          <CheckBox containerStyle={styles.CheckBox}
            title='16-30'
            checked={participantAgeRange == "16-30"}
            onPress={() => participantAgeRange != "16-30" ? setParticipantAgeRange("16-30") : setParticipantAgeRange(null)}

          />

          <CheckBox containerStyle={styles.CheckBox}
            title='30-50'
            checked={participantAgeRange == "30-50"}
            onPress={() => participantAgeRange != "30-50" ? setParticipantAgeRange("30-50") : setParticipantAgeRange(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title='50 +'
            checked={participantAgeRange == "50+"}
            onPress={() => participantAgeRange != "50+" ? setParticipantAgeRange("50+") : setParticipantAgeRange(null)}

          />
          <CheckBox containerStyle={styles.CheckBox}
            title="Dosen't Matter"
            checked={participantAgeRange == "Dosen't Matter"}
            onPress={() => participantAgeRange != "Dosen't Matter" ? setParticipantAgeRange("Dosen't Matter") : setParticipantAgeRange(null)}

          />
        </View>


        <FormButton
          buttonTitle="Complete Sign Up"
          onPress={() => completeSignUp()}
        />

      </ View>
    </ScrollView >
  );
};

export default FeedSettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: windowWidth / 20,

  },
  radioBtnContainer: {

    marginVertical: windowHeight / 150,
    width: '100%',
  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    color: '#051d5f',
    marginBottom: windowHeight / 25,
    marginTop: windowHeight / 30
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


  CheckBox:
  {
    borderWidth: 0,
    backgroundColor: 'transparent'
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
