import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import FormButton from '../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'
import HorizontalLine from '../components/HorizontalLine';
import MyLinearGradient from '../components/MyLinearGradient';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import axios from 'axios';


import { useSelector, useDispatch } from 'react-redux';
import { updateFeedSettingsRedux } from '../../store/actions/user';


import { register } from '../../store/actions/auth';

import { Toast } from "native-base";
import * as Font from "expo-font";
import { Appbar, Button as Btn } from 'react-native-paper';



const EditFeedSettingsScreen = (props) => {
  let userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();
  const [userType, setUserType] = useState();
  const [postsLocation, setPostsLocation] = useState();
  const [fromGender, setFromGender] = useState();
  const [participantAgeRange, setParticipantAgeRange] = useState();
  const [fontsLoaded, setFontsLoaded] = useState(false);



  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),

      })
    }
    loadFonts();
    setFontsLoaded(true)

  }, [])



  const updateFeedSettings = async () => {

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
    // console.log(feedSettings)
    let body = JSON.stringify(feedSettings);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }

    }
    const updateFeedSettingsURL = `https://proj.ruppin.ac.il/bgroup14/prod/api/member/updatefeedsettings/${userId}`
    try {
      const res = await axios.put(updateFeedSettingsURL, body, config);
      dispatch(updateFeedSettingsRedux(feedSettings));

      Toast.show({
        text: "Feed settings updated successfully!",
        // buttonText: "Okay",
        type: "success",
        duration: 4000
      });
      props.navigation.navigate('MyProfile')



      // Alert.alert(
      //   "Feed Settings Updated",
      //   res.data,
      //   [
      //     { text: 'OK', onPress: () => props.navigation.navigate('Home') },
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

      console.log("body is " + body)


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

  if (!fontsLoaded) {
    return (
      <View></View>
    );

  }
  return (
    <ScrollView >
      {/* <MyLinearGradient firstColor="#ffffff" secondColor="#dfe9f3" height={2000} /> */}
      <MyLinearGradient firstColor="#ffffff" secondColor="#e7f0fd" height={1500} />
      <View style={{ marginBottom: windowHeight / 40 }}>
        <Appbar.Header style={{ backgroundColor: '#3b5998' }} >

          <Appbar.BackAction onPress={() => props.navigation.navigate('MyProfile')} />
          <Appbar.Content title="Feed Settings" />
        </Appbar.Header>
      </View>
      <View style={styles.container}>

        {/* <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate('MyProfile')}
          >
            <Text style={styles.barReset}>Cancel</Text>
          </TouchableOpacity>
          <View style={{ marginRight: 120 }}>
            <Text style={styles.text}>Feed Settings</Text>
          </View>


        </View> */}

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


        {/* <FormButton
          buttonTitle="Update"
          onPress={() => updateFeedSettings()}
        /> */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: windowHeight / 40 }}>
          <Btn uppercase={false} color='#3b5998' style={{ width: windowWidth / 1.1, height: windowHeight / 20 }} mode="outlined" onPress={() => updateFeedSettings()}>
            Update Feed Settings </Btn>
        </View>



      </ View>
    </ScrollView >
  );
};

export default EditFeedSettingsScreen;

const styles = StyleSheet.create({
  container: {
    // padding: windowWidth / 50,

  },
  radioBtnContainer: {

    marginVertical: windowHeight / 150,
    // width: '100%',
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
    fontStyle: 'italic',
    marginLeft: windowWidth / 20,

  },
  // headerContainer:
  // {
  //   flex: 1,
  //   alignItems: 'center'
  // }
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
  barReset: {
    color: 'red',
    marginTop: windowHeight / 140,
    //marginLeft: 200
  },


});
