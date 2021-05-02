import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Alert } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import TextArea from '../components/TextArea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import MyCamera from '../components/MyCamera';

import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useFocusEffect } from '@react-navigation/native';
import MyBottomSheet from '../components/MyBottomSheet';
import MyLinearGradient from '../components/MyLinearGradient';
import { RadioButton } from 'react-native-paper';
import GooglePlacesInput from '../components/GooglePlacesInput';
import { KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { updateImage } from '../../store/actions/user';
import { Toast } from "native-base";
import * as Font from "expo-font";

import { Appbar, Button as Btn } from 'react-native-paper';







const EditProfile = (props) => {
  const dispatch = useDispatch();
  const [userCurrentCity, setUserCurrentCity] = useState();
  const [userCurrentImage, setUserCurrentImage] = useState();
  const [userCurrentBio, setUserCurrentBio] = useState();
  const [userCurrentOccupation, setUserCurrentOccupation] = useState();
  const [userCurrentDateOfBirth, setUserCurrentDateOfBirth] = useState();
  const [userCurrentGender, setUserCurrentGender] = useState();
  const uplodedPicPath = 'http://proj.ruppin.ac.il/bgroup14/prod/Userimage/';
  const [uploadedPicture, setUploadedPicture] = useState({});
  const [pictureWasUpdated, setPictureWasUpdated] = useState(false);

  const [city, setCity] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [visible, setVisible] = useState(false);
  const [bio, setBio] = useState();
  const [occupation, setOccupation] = useState();
  const [dateLabel, setDateLabel] = useState('Date of birth');
  const [gender, setGender] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [unixDate, setUnixDate] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);


  const [checked, setChecked] = useState('first');


  const toggleOverlay = () => {
    setVisible(!visible);
  };




  useEffect(() => {


    const loadFonts = async () => {
      await Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

      })
    }
    loadFonts();
    setFontsLoaded(true)



    clearAsHobbies("hobbies")


    if (!pictureWasUpdated) {
      // console.log("pictrue ws updated? " + pictureWasUpdated)
      fetchUserDetails();
    }

    else {

      updateProfie();


    }

  }, [uploadedPicture])

  const clearAsHobbies = async (key) => {

    try {
      await AsyncStorage.removeItem(key);
      // console.log("AS Hobbies removed")
      return true;
    }
    catch (exception) {
      return false;
    }
  }


  let userId = useSelector(state => state.auth.userId);
  const userDetailsFetchURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/getmyprofile/${userId}`

  const fetchUserDetails = async () => {
    //   console.log("fetching user details...");
    const res = await axios(userDetailsFetchURL);
    //console.log(res.data)
    setUserCurrentImage(res.data.pictureUrl)
    //console.log(res.data.city + "cityy")
    //setUserAge(res.data.age)

    setUserCurrentBio(res.data.bio)
    let cityName = res.data.city.replace(/,[^,]+$/, "")
    setUserCurrentCity(cityName)
    setUserCurrentDateOfBirth(res.data.dateOfBirth)
    setDateLabel(res.data.dateOfBirth)
    setUserCurrentGender(res.data.gender)

    // console.log(str)
    setUserCurrentOccupation(res.data.occupation)


  }






  useFocusEffect(
    React.useCallback(() => {
      //console.log(windowHeight)

      getDataFromAS();

    }, [])
  )


  const takePhoto = async () => {
    toggleOverlay();
    setCameraOn(true)

  }
  //Check if delete this below???
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);


  const openImagePickerAsync = async () => {
    toggleOverlay();
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    //console.log("picker res is:!!!")
    // console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage(pickerResult.uri);
  };


  const getDataFromAS = async () => {
    try {

      const hobbiesJsonValue = await AsyncStorage.getItem('hobbies')
      let jsonObjHobbies = hobbiesJsonValue != null ? JSON.parse(hobbiesJsonValue) : null;
      if (jsonObjHobbies != null) {
        setHobbies(jsonObjHobbies)
        // console.log("hobbies wwere saved!: ")
      } else {
        setHobbies([])
        // console.log("hobbies AS are null")
      }


    } catch (e) {
      console.log("error !!")
      // error reading value
    }
  }
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('profileSetupDetails', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }
  const updateProfie = async () => {
    // console.log(userCurrentImage)
    if (uploadedPicture.uri == undefined) {
      // console.log("is undefiend!!")
      setImage();
      return null;
    }
    // console.log("is defined!!!!!")

    let profileSetupDetails = {
      city: userCurrentCity,
      occupation: userCurrentOccupation,
      bio: userCurrentBio,
      gender: userCurrentGender,
      unixDate,
      pictureUrl: uploadedPicture.uri,
      hobbies: hobbies.length > 0 ? hobbies : null,

    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }

    }

    const body = JSON.stringify(profileSetupDetails)
    try {
      const res = await axios.put(`https://proj.ruppin.ac.il/bgroup14/prod/api/member/Updateprofile/${userId}`, body, config);
      dispatch(updateImage(uploadedPicture.uri));

      Toast.show({
        text: "Profile updated successfully!",
        // buttonText: "Okay",
        type: "success",
        duration: 4000
      });



      props.navigation.navigate('MyProfile')

      // Alert.alert(
      //   "Profile Updated",
      //   res.data,
      //   [

      //     { text: 'OK', onPress: () => props.navigation.navigate('MyProfile') },
      //   ],
      // );



    } catch (error) {
      Alert.alert(
        "OOPS!",
        "An error has occured sending the data",
        [

          { text: "OK" }
        ],
      );

    }
    // console.log(body)
    //console.log("Profile updated detials are " + userCurrentImage)
    return null;
    // storeData(profileSetupDetails).then(
    //   props.navigation.navigate('FeedSettings')
    // );
  }

  const setImage = () => {
    // console.log("selected image is " + selectedImage)
    if (selectedImage != null) {
      let urlAPI = "http://proj.ruppin.ac.il/bgroup14/prod/uploadpicture";
      let imgName = "alan93@walla.co.il" + '_imgFromCamera.jpg';
      let imgUri = selectedImage
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
          //  console.log('res.status=', res.status);
          if (res.status == 201) {
            return res.json();
          }
          else {
            console.log('error uploding res is  ...' + res.statusText + res.message);
            return "err";
          }
        })
        .then((responseData) => {
          // console.log(responseData);
          if (responseData != "err") {
            let picNameWOExt = imgName.substring(0, imgName.indexOf("."));
            let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt), responseData.indexOf(".jpg") + 4);
            let uploadedPicture = ({ uri: uplodedPicPath + imageNameWithGUID })
            // return uploadedPicture;
            setPictureWasUpdated(true)
            setUploadedPicture({ uri: uplodedPicPath + imageNameWithGUID })


            console.log("img uploaded successfully!");
          }
          else {
            console.log('error uploding ...');
            alert('error uploding ...');
          }
        })
        .catch(err => {
          alert('err upload= ' + err);
        });
      // return selectedImage;
    } else {
      setPictureWasUpdated(true)
      setUploadedPicture({ uri: userCurrentImage })


      // console.log(userCurrentImage)
    }


  }



  let image = userCurrentImage ?
    <TouchableOpacity onPress={() => toggleOverlay()}>
      <Image
        source={{ uri: userCurrentImage }}
        style={styles.profileImage}
      />
    </TouchableOpacity> : <TouchableOpacity onPress={() => toggleOverlay()} >
      <Image
        source={require('../../assets/camera.png')}
        style={styles.camera}
      />

    </TouchableOpacity>

  if (selectedImage !== null) {
    image = <TouchableOpacity onPress={() => toggleOverlay()}>
      <Image source={{ uri: selectedImage }} style={styles.profileImage} />

    </TouchableOpacity>

  }

  const getCamImage = (imagePath) => {
    setSelectedImage(imagePath)
  }

  const getCityName = (cityName) => {
    // console.log("city name is: " + cityName)
    setUserCurrentCity(cityName)

  }


  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChangeDate = (event, selectedDate) => {

    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let slicedDate = currentDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
    setDateLabel(slicedDate)
    let unixDateToSend = Math.floor(selectedDate.getTime() / 1000)
    setUnixDate(unixDateToSend)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  const checkDate = () => {
    console.log(date)
    console.log(dateLabel)
    console.log("unix date is: " + unixDate)
  }

  const hobbisTitleFunc = () => {
    if (hobbies.length == 0) {
      return "Click to select your hobbies"
    }
    else if (hobbies.length == 1) {
      return "You have selected 1 hobby"
    }
    else {
      return `You have selected ${hobbies.length} hobbies`
    }

  }


  let datePicker = show ?
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      is24Hour={true}
      display="default"
      onChange={onChangeDate}
    /> : <Text></Text>




  let profileSetupScreen = cameraOn == true ? <MyCamera sendImagePath={(imagePath) => { getCamImage(imagePath) }} toggleCamera={() => setCameraOn(false)} />
    :
    <KeyboardAvoidingView>
      <Appbar.Header style={{ backgroundColor: '#3b5998' }} >

        <Appbar.BackAction onPress={() => props.navigation.navigate('MyProfile')} />
        <Appbar.Content title="Edit Profile" />
      </Appbar.Header>
      <View >

        <MyBottomSheet visible={visible} toggle={toggleOverlay} >
          <View>
            <View style={styles.btnContainer}>
              <Button
                icon={
                  <Icon
                    name="image"
                    size={25}
                    color="blue"
                    style={{ padding: 10 }}
                  />
                }
                title="Choose From Gallery"
                type='outline'
                buttonStyle={styles.profilePictureBtn}
                onPress={() => openImagePickerAsync()}

              />
              <Button
                icon={
                  <Icon
                    name="camera"
                    size={25}
                    color="blue"
                    style={{ padding: 10 }}

                  />
                }
                title="Take Photo"
                type='outline'
                buttonStyle={styles.profilePictureBtn}
                onPress={() => takePhoto()}

              />
            </View>
          </View>
        </MyBottomSheet>


        <View style={styles.container}>
          {/* <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => props.navigation.navigate('MyProfile')}
            >
              <Text style={styles.barReset}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ marginRight: 120 }}>
              <Text style={styles.text}>Profile Setup</Text>
            </View>


          </View> */}
          <View style={styles.imageContainer}>
            {image}
          </View>

          <View style={styles.setupParamsContainer}>
            <Text style={styles.setupParams}>CURRENT CITY</Text>
            <GooglePlacesInput getCityName={(cityName) => getCityName(cityName)} currentCity={userCurrentCity} />


          </View>
          <View style={styles.setupParamsContainer}>
            <Text style={styles.setupParams}>SHORT BIO</Text>

            <TextArea
              labelValue={userCurrentBio}
              placeholderText={userCurrentBio}
              iconType="calendar"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setUserCurrentBio(text)}

            />
          </View >
          <View style={styles.setupParamsContainer}>
            <Text style={styles.setupParams}>OCCUPATION</Text>

            <FormInput
              labelValue={userCurrentOccupation}
              placeholderText={userCurrentOccupation}
              iconType="suitcase"
              autoCapitalize='words'
              onChangeText={(text) => setUserCurrentOccupation(text)}
            />
          </View>
          <View style={styles.setupParamsContainer}>
            <Text style={styles.setupParams}>DATE OF BIRTH</Text>
            <TouchableOpacity onPress={showDatepicker}>
              <FormInput
                onDatePress={showDatepicker}
                labelValue={dateLabel}
                // placeholderText={dateLabel}
                placeholderText={userCurrentDateOfBirth}
                iconType="calendar"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                onChangeText={(text) => setDateOfBirth(text)}
              />

            </TouchableOpacity>
          </View>



          <View style={styles.setupParamsContainer}>
            <Text style={styles.setupParams}>HOBBIES</Text>

            <TouchableOpacity style={styles.dropDownContainer} >
              <Button
                title={hobbisTitleFunc()}
                type="outline"
                raised={true}
                buttonStyle={{ padding: 15, borderRadius: 15 }}
                onPress={() => props.navigation.navigate('EditHobbiesScreen')}

              />
            </TouchableOpacity>
          </View>



          <View style={styles.genderContainer}>
            <Text style={styles.setupParams}>GENDER</Text>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton
                color="blue"
                value="first"
                status={userCurrentGender === 'Male' ? 'checked' : 'unchecked'}
                onPress={() => setUserCurrentGender('Male')}
              />
              <Text style={{ marginTop: 6, marginRight: windowWidth / 20 }}>Male</Text>

              <RadioButton
                color="pink"
                value="second"
                status={userCurrentGender === 'Female' ? 'checked' : 'unchecked'}
                onPress={() => setUserCurrentGender('Female')}
              />
              <Text style={{ marginTop: 6, marginRight: windowWidth / 100 }}>Female</Text>

            </View>

          </View>



          {/* <View style={styles.nextBtnContainer}>
            <FormButton
              buttonTitle="Update"
              onPress={() => updateProfie()}

            />
          </View> */}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Btn uppercase={false} color='#3b5998' style={{ width: windowWidth / 1.1, height: windowHeight / 20, borderRadius: 15 }} mode="outlined" onPress={() => updateProfie()}>
              Update Profile </Btn>
          </View>


        </View>
      </View >
    </KeyboardAvoidingView>



  if (!fontsLoaded) {
    return (
      <View></View>
    );

  }


  return (

    <Fragment>
      <MyLinearGradient firstColor="#ffffff" secondColor="#dfe9f3" height={2000} />
      {profileSetupScreen}
      {datePicker}
    </Fragment>


  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  text: {

    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    color: '#051d5f',
    marginTop: 10
  },


  logo: {
    height: 200,
    width: 200,
    resizeMode: 'cover',
  },
  camera: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  imageContainer: {
    marginVertical: windowHeight / 80,
    alignItems: 'center'

  },
  overlayStyle: {
    flex: 1,
    height: '200',
    width: '80%'
  },
  overlayHeadline: {
    fontSize: 24
  },
  btnContainer: {

  },
  profilePictureBtn: {
    justifyContent: 'flex-start',
    borderWidth: 0

  },
  dropDownContainer: {

    marginTop: 5,
    marginBottom: 10,
    width: '99%',
    height: windowHeight / 15,
    borderRadius: 60,
    borderColor: '#ccc',


  },
  profileImage: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    borderRadius: 100
  },
  setupParams: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  genderContainer: {
    marginVertical: 5
  },
  headerContainer: {
    flexDirection: 'row-reverse',
    margin: windowHeight / 160,
    //marginTop: windowHeight / 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    // flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 30,
    // height: windowHeight / 10,
    //  alignItems: 'center'
  },
  nextBtnContainer: {

  },
  barReset: {
    color: 'red',
    marginTop: windowHeight / 40,
    //marginLeft: 200
  },

});
