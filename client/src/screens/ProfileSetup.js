import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyOverlay from '../components/MyOverlay';
import * as ImagePicker from 'expo-image-picker';
import MyCamera from '../components/MyCamera';

const ProfileSetup = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [signUpDetails, setSignUpDetails] = useState({});
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };


  useEffect(() => {
    getData();

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




  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('signUpDetails')
      let jsonObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (jsonObj != null) {
        setSignUpDetails(jsonObj)
        console.log("sign up details from previous page: " + jsonObj.fullName)
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





  let profileSetupScreen = cameraOn == true ? <MyCamera sendImagePath={(imagePath) => { getCamImage(imagePath) }} toggleCamera={() => setCameraOn(false)} /> :
    <Fragment>
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

          placeholderText="Full"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={email}
          placeholderText="Email"
          iconType="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          //   onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormInput
          //  labelValue={confirmPassword}
          //  onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />


        <FormButton
          buttonTitle="Next"
          onPress={() => props.navigation.navigate('FeedSettings')}

        //  onPress={() => register(email, password)} go to - profile setup
        />

        <FormButton
          buttonTitle="check async storage"
          onPress={() => check()}

        //  onPress={() => register(email, password)} go to - profile setup
        />








        <TouchableOpacity
          style={styles.navButton}
          onPress={() => props.navigation.navigate('SignIn')}>
          <Text style={styles.navButtonText}>Have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </Fragment>


  return (
    <Fragment>
      {profileSetupScreen}
    </Fragment>

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

  }

});
