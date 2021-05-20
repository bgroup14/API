import React, { Fragment, useState } from 'react';
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
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { useFocusEffect } from '@react-navigation/native';
import MyBottomSheet from '../components/MyBottomSheet';
import MyLinearGradient from '../components/MyLinearGradient';
import { RadioButton } from 'react-native-paper';
import GooglePlacesInput from '../components/GooglePlacesInput';
import { KeyboardAvoidingView } from 'react-native';



const ProfileSetup = (props) => {
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

  const [checked, setChecked] = useState('first');

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  useFocusEffect(
    React.useCallback(() => {

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
      }
      const hobbiesJsonValue = await AsyncStorage.getItem('hobbies')
      let jsonObjHobbies = hobbiesJsonValue != null ? JSON.parse(hobbiesJsonValue) : null;
      if (jsonObjHobbies != null) {
        setHobbies(jsonObjHobbies)
      } else {
        setHobbies([])
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


  const checkIfFormIsFilled = (obj) => {


    for (const x in obj) {

      if (obj[x] === null || obj[x] === undefined) {
        return true;
      }
    }
    return false;


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


    }
    if (checkIfFormIsFilled(profileSetupDetails)) {
      Alert.alert(
        "",
        "Please fill the entire form",
        [
          { text: "OK" }
        ],
      );
      return null
    }

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

  const getCityName = (cityName) => {
    setCity(cityName)

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
          <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
              {image}
            </View>
          </View>
          <View style={{ marginTop: windowHeight / 30 }}>

            <View style={styles.setupParamsContainer}>
              <Text style={styles.setupParams}>CURRENT CITY</Text>
              <GooglePlacesInput getCityName={(cityName) => getCityName(cityName)} />

            </View>
            <View style={styles.setupParamsContainer}>
              <Text style={styles.setupParams}>SHORT BIO</Text>

              <TextArea
                labelValue={bio}
                placeholderText="Enter a short bio..."
                iconType="calendar"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => setBio(text)}

              />
            </View >
            <View style={styles.setupParamsContainer}>
              <Text style={styles.setupParams}>OCCUPATION</Text>

              <FormInput
                labelValue={occupation}
                placeholderText="Occupation"
                iconType="suitcase"
                autoCapitalize='words'
                onChangeText={(text) => setOccupation(text)}
              />
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
              <Text style={styles.setupParams}>HOBBIES</Text>

              <TouchableOpacity style={styles.dropDownContainer} >
                <Button
                  title={hobbisTitleFunc()}
                  type="outline"
                  raised={true}
                  buttonStyle={{ padding: 15, borderRadius: 15 }}
                  onPress={() => props.navigation.navigate('HobbiesScreen')}

                />
              </TouchableOpacity>
            </View>



            <View style={styles.genderContainer}>
              <Text style={styles.setupParams}>GENDER</Text>
              <View style={{ flexDirection: 'row' }}>
                <RadioButton
                  color="blue"
                  value="first"
                  status={gender === 'Male' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('Male')}
                />
                <Text style={{ marginTop: 6, marginRight: windowWidth / 20 }}>Male</Text>

                <RadioButton
                  color="pink"
                  value="second"
                  status={gender === 'Female' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('Female')}
                />
                <Text style={{ marginTop: 6, marginRight: windowWidth / 100 }}>Female</Text>

              </View>

            </View>
          </View>



          <View  >
            <View style={styles.nextBtnContainer}>
              <FormButton
                buttonTitle="Next"
                onPress={() => goToFeedSettings()}

              />
            </View>
          </View>


        </View>
      </View >
    </KeyboardAvoidingView>


  return (

    <Fragment>
      <MyLinearGradient firstColor="#ffffff" secondColor="#dfe9f3" height={2000} />
      {profileSetupScreen}
      {datePicker}
    </Fragment>


  );
};

export default ProfileSetup;

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
    margin: windowHeight / 50,
    marginTop: windowHeight / 30
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
    borderRadius: 100,
    marginTop: windowHeight / 100
  },
  setupParamsContainer: {
  },
  setupParams: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  genderContainer: {
    marginVertical: 5
  },
  headerContainer: {
    alignItems: 'center'
  },
  nextBtnContainer: {

  }

});
