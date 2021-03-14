import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, Platform } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import TextArea from '../components/TextArea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyOverlay from '../components/MyOverlay';
import * as ImagePicker from 'expo-image-picker';
import MyCamera from '../components/MyCamera';

import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useFocusEffect } from '@react-navigation/native';
import MyBottomSheet from '../components/MyBottomSheet';
import MyLinearGradient from '../components/MyLinearGradient';


// import { BottomSheet } from 'react-native-btr';






const ProfileSetup = (props) => {
  const [city, setCity] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [visible, setVisible] = useState(false);
  const [bio, setBio] = useState();
  const [occupation, setOccupation] = useState();
  const [dateLabel, setDateLabel] = useState('Date of birth');
  const [gender, setGender] = useState();
  const [hobbies, setHobbies] = useState([]);
  const [unixDate, setUnixDate] = useState(new Date());

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  // useEffect(() => {
  //   getDataFromAS();

  // }, [])

  useFocusEffect(
    React.useCallback(() => {

      getDataFromAS();

    }, [])
  )


  const takePhoto = async () => {
    toggleOverlay();
    setCameraOn(true)
    // const photo = await ref.current.takePictureAsync({ quality: 0.2 });
    // console.log("in my profile setup")
    // try {

    //   setSelectedImage(photo.uri);
    //   //setImageHasSelected(true)
    //   setCameraOn(false);
    //   console.debug(photo)
    // } catch (error) {

    // }

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
    console.log("picker res is:!!!")
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage(pickerResult.uri);
  };


  const getDataFromAS = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up name from previous page: " + jsonObj.fullName)
      }
      const hobbiesJsonValue = await AsyncStorage.getItem('hobbies')
      let jsonObjHobbies = hobbiesJsonValue != null ? JSON.parse(hobbiesJsonValue) : null;
      if (jsonObjHobbies != null) {
        setHobbies(jsonObjHobbies)
        console.log("hobbies wwere saved!: ")
      } else {
        setHobbies([])
        console.log("hobbies AS are null")
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
  const goToFeedSettings = () => {
    let image = setImage();

    let profileSetupDetails = {
      city,
      occupation,
      bio,
      gender,
      date: unixDate,
      image,
      // myImage: selectedImage,
      // fbImage: signUpDetails.fbImage


    }
    //  console.log(signUpDetails)
    storeData(profileSetupDetails).then(
      props.navigation.navigate('FeedSettings')
    );
  }

  const setImage = () => {
    if (selectedImage != null) {
      return selectedImage;
    } else if (signUpDetails.fbImage != undefined) {
      return signUpDetails.fbImage;
    }


  }


  const check = () => {
    console.log(hobbies)
    console.log(hobbies.length)

  }
  let image = signUpDetails.fbImage ? <Image
    source={{ uri: signUpDetails.fbImage }}
    style={styles.profileImage}
  /> : <TouchableOpacity onPress={() => toggleOverlay()} >
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







  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChangeDate = (event, selectedDate) => {

    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // // console.log(selectedDate.toString())
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
    //console.log(gender)
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
    <ScrollView >

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
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.text}>Profile Setup</Text>
          <View style={styles.imageContainer}>
            {image}
          </View>
        </View>

        <View style={styles.setupParamsContainer}>
          <Text style={styles.setupParams}>CURRENT CITY</Text>


          <FormInput
            labelValue={city}
            placeholderText="City"
            iconType="home"
            autoCapitalize="none"
            autoCorrect={true}
            onChangeText={(text) => setCity(text)} />
        </View>
        <View style={styles.setupParamsContainer}>
          <Text style={styles.setupParams}>DATE OF BIRTH</Text>
          <TouchableOpacity onPress={showDatepicker}>
            <FormInput
              onDatePress={showDatepicker}
              // labelValue={dateLabel}
              placeholderText={dateLabel}
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
          <Text style={styles.setupParams}>OCCUPATION</Text>

          <FormInput
            labelValue={occupation}
            placeholderText="Occupation"
            iconType="suitcase"
            onChangeText={(text) => setOccupation(text)}
          />
        </View>

        <View style={styles.setupParamsContainer}>
          <Text style={styles.setupParams}>GENDER</Text>

          <DropDownPicker
            placeholder="Select"
            items={[
              { label: 'Male', value: 'male', icon: () => <Icon name="male" size={18} color="blue" /> },
              { label: 'Female', value: 'female', icon: () => <Icon name="female" size={18} color="pink" /> },
            ]}
            //defaultValue={null}
            containerStyle={styles.dropDownContainer}
            // style={{ borderWidth: 1, borderColor: '#ccc' }}
            itemStyle={{

              justifyContent: 'center', marginTop: 10
            }}
            onChangeItem={item => setGender(item.value)
            }
          />
        </View>
        <View style={styles.setupParamsContainer}>
          <Text style={styles.setupParams}>SHORT BIO</Text>

          <TextArea
            labelValue={bio}
            placeholderText="What do you want people to know about you?"
            iconType="calendar"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setBio(text)}

          />
        </View >
        <View style={styles.setupParamsContainer}>
          <Text style={styles.setupParams}>HOBBIES</Text>

          <TouchableOpacity style={styles.dropDownContainer} >
            <Button
              title={hobbisTitleFunc()}
              type="outline"
              raised={true}
              buttonStyle={{ padding: 15 }}
              onPress={() => props.navigation.navigate('HobbiesScreen')}

            />
          </TouchableOpacity>
        </View>

        <View  >
          <FormButton
            buttonTitle="Next"
            onPress={() => goToFeedSettings()}

          />
        </View>


        {/* <FormButton
          buttonTitle="Check Date console log"
          onPress={() => checkDate()}


        />
        <FormButton
          buttonTitle="Check hobbies"
          onPress={() => check()}


        /> */}



        {/* <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30
        }}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => props.navigation.navigate('SignIn')}>
            <Text style={styles.navButtonText}>Have an account? Sign In</Text>
          </TouchableOpacity>
        </View> */}


      </View>
    </ScrollView >


  return (
    // <Fragment>

    <Fragment>
      <MyLinearGradient firstColor="#ffffff" secondColor="#dfe9f3" height={2000} />

      {profileSetupScreen}
      {datePicker}
    </Fragment>
    // </Fragment>

  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  container: {
    //  backgroundColor: 'fff',
    // backgroundColor: '#f9fafd',
    // flex: 1,
    // justifyContent: 'flex-start',
    //  alignItems: 'flex-start',
    padding: 15,

  },
  text: {

    // fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    margin: 40
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
    padding: 20
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
    width: '98%',
    height: windowHeight / 15,

  },
  profileImage: {
    width: 120,
    height: 120
  },
  setupParams: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  setupParamsContainer: {
  }

});
