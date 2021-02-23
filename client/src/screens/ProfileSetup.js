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

import DropDownPicker from 'react-native-dropdown-picker';
import { windowHeight, windowWidth } from '../../utils/Dimentions';


const ProfileSetup = (props) => {
  const [city, setCity] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [visible, setVisible] = useState(false);
  const [bio, setBio] = useState();
  const [occupation, setOccupation] = useState();
  const [dateLabel, setDateLabel] = useState('Date of birth');
  const [gender, setGender] = useState();
  const [hobbies, setHobbies] = useState({});

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  useEffect(() => {
    getDataFromAS();

  }, [])


  const takePhoto = async () => {
    toggleOverlay();
    setCameraOn(true)
    const photo = await ref.current.takePictureAsync();
    try {

      setSelectedImage(photo.uri);
      setImageHasSelected(true)
      setCameraOn(false);
      console.debug(photo)
    } catch (error) {

    }

  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const [hasPermission, setHasPermission] = useState(null);
  const ref = useRef(null);
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
    setImageHasSelected(true);

  };




  const getDataFromAS = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up name from previous page: " + jsonObj.fullName)
      }

    } catch (e) {
      console.log("error !!")
      // error reading value
    }
  }

  const check = () => {

    console.log(signUpDetails.fullName)
  }
  let image = signUpDetails.fbImage ? <Image
    source={{ uri: signUpDetails.fbImage }}
    style={styles.logo}
  /> : <TouchableOpacity onPress={() => toggleOverlay()}>
      <Image
        source={require('../../assets/camera.png')}
        style={styles.camera}
      />

    </TouchableOpacity>

  if (selectedImage !== null) {
    image = <TouchableOpacity onPress={() => toggleOverlay()}>
      <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />

    </TouchableOpacity>

  }

  const getCamImage = (imagePath) => {
    setSelectedImage(imagePath)
  }







  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let slicedDate = selectedDate.toString().slice(3, 15).replace(/ /g, "/").substring(1); // format of Feb/01/2020
    //var s2 = s1.substring(1);
    //let fuck = slicedDate.replace(' ', '+');
    setDateLabel(slicedDate)
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
    console.log(gender)
  }









  let datePicker = show ?
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      is24Hour={true}
      display="default"
      onChange={onChange}
      animationType={"fade"}
    /> : <Text></Text>



  let profileSetupScreen = cameraOn == true ? <MyCamera sendImagePath={(imagePath) => { getCamImage(imagePath) }} toggleCamera={() => setCameraOn(false)} /> :
    <ScrollView>
      <MyOverlay isVisible={visible} onBackdropPress={toggleOverlay} style={styles.overlayStyle} >
        <View style={styles.container} >




          <Text style={styles.overlayHeadline}>Set Up Profile Picture</Text>
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
      </MyOverlay>


      <View style={styles.container}>
        <Text style={styles.text}>Profile Setup</Text>
        <View style={styles.imageContainer}>
          {image}
        </View>

        <FormInput
          labelValue={city}
          placeholderText="City"
          iconType="home"
          autoCapitalize="none"
          autoCorrect={true}
          onChangeText={(text) => setCity(text)} />

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

        <FormInput
          labelValue={occupation}
          //   onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Occupation"
          iconType="suitcase"
          onChangeText={(text) => setOccupation(text)}
        />

        <TextArea
          labelValue={bio}
          placeholderText="What do you want people to know about you?"
          iconType="calendar"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setBio(text)}

        />


        <DropDownPicker
          placeholder="Gender"
          items={[
            { label: ' Male', value: 'male', icon: () => <Icon name="male" size={18} color="blue" /> },
            { label: 'Female', value: 'female', icon: () => <Icon name="female" size={18} color="pink" /> },
          ]}
          //defaultValue={null}
          containerStyle={styles.dropDownContainer}
          style={{ backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' }}
          itemStyle={{

            justifyContent: 'center', marginTop: 10
          }}
          dropDownStyle={{ backgroundColor: 'white' }}
          onChangeItem={item => setGender(item.value)
          }
        />


        <FormButton
          buttonTitle="Next"
          onPress={() => props.navigation.navigate('FeedSettings')}

        />

        <FormButton
          buttonTitle="Check Date console log"
          onPress={() => checkDate()}


        />



        <TouchableOpacity
          style={styles.navButton}
          onPress={() => props.navigation.navigate('SignIn')}>
          <Text style={styles.navButtonText}>Have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>


  return (
    <View>
      {profileSetupScreen}
      {datePicker}
    </View>

  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,

  },
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
  camera: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
  },
  imageContainer: {
    padding: 20
  },
  overlayStyle: {
    height: '20',
    width: '80%'
  },
  overlayHeadline: {
    fontSize: 24
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    padding: 20,

  },
  profilePictureBtn: {
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',

  },
  dropDownContainer: {
    marginTop: 5,
    marginBottom: 10,
    //height: 40,
    width: '100%',
    height: windowHeight / 15,
    // borderColor: '#ccc',
    // borderRadius: 3,
    //borderWidth: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    //backgroundColor: '#fff',
  },

});
