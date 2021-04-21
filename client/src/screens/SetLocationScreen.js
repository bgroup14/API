import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

import * as Location from 'expo-location';
import GooglePlacesInput from '../components/GooglePlacesInput';
import { ScrollView } from 'react-native-gesture-handler';





const SetLocationScreen = (props) => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [address, setAddress] = useState(null);
    const [addressShow, setAddressShow] = useState(false);

    // useEffect(() => {
    //     (async () => {

    //         let { status } = await Location.requestPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }

    //         let location = await Location.getCurrentPositionAsync({});
    //         setLocation(location);
    //     })();
    // }, []);


    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        console.log(location.coords.latitude)
    }
    const setToMyArea = async () => {

        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        //setLocation(location);


        let regionName = await Location.reverseGeocodeAsync({ longitude: location.coords.longitude, latitude: location.coords.latitude });
        console.log(regionName[0].city)
        let locationObj = {
            locationLabel: regionName[0].city,
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        }
        props.setLocation(locationObj);
        props.closeSetLocation();



    }
    const setToZoom = () => {
        let locationObj = {
            locationLabel: "Zoom Meeting"

        }
        props.closeSetLocation();
        props.setLocation(locationObj);

    }
    const getCityName = (cityName) => {
        console.log("city name is: " + cityName)
        // setCity(cityName)

    }
    const getCoordinets = (coordinates) => {

        let locationObj = {
            locationLabel: coordinates.locationLabel,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude
        }
        props.setLocation(locationObj);
        props.closeSetLocation();
        console.log("lat issss:" + coordinates.latitude)
        console.log("long issss:" + coordinates.longitude)
    }




    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Meeting Location</Text>
                {/* <Text style={styles.header}>{adress}</Text> */}
            </View>
            <View style={styles.optionsContainer}>
                <View style={styles.btnContainer}>
                    <Button
                        icon={
                            <Icon
                                name="home"
                                size={35}
                                color="#92a8d1"
                                style={{ padding: 6 }
                                }
                            />
                        }
                        title="My Area"
                        type='clear'
                        buttonStyle={styles.locationBtn}
                        onPress={() => setToMyArea()}

                    //  onPress={() => openImagePickerAsync()}

                    />
                </View>
                <View style={styles.btnContainer}>
                    <Button
                        icon={
                            <Icon
                                name="video-camera"
                                size={35}
                                color="#92a8d1"
                                style={{ padding: 6 }}
                            />
                        }
                        title="Zoom"
                        type='clear'
                        buttonStyle={styles.locationBtn}
                        onPress={() => setToZoom()}

                    />
                </View>
                <View style={styles.btnContainer}>
                    <Button
                        icon={
                            <Icon
                                name="map-marker"
                                size={38}
                                color="#92a8d1"
                                style={{ padding: 6, marginLeft: 3 }}
                            />
                        }

                        title="Custom Address"
                        type='clear'
                        buttonStyle={styles.locationBtn}
                        onPress={() => setAddressShow(true)}

                    />


                </View>
                {addressShow ? <GooglePlacesInput getCityName={(cityName) => getCityName(cityName)}
                    meeting={true} sendCoordinatesObj={(coordinates) => getCoordinets(coordinates)} />
                    : null}
            </View>
        </View>
    )
}

export default SetLocationScreen

const styles = StyleSheet.create({

    container: {
        // justifyContent: 'center',
        //  alignItems: 'center'
    },
    optionsContainer: {
        alignItems: 'flex-start'
    },
    headerContainer: {
        alignItems: 'center'
    },
    header: {
        fontSize: 24,

        color: '#3b5998'
    },
    btnContainer: {
        marginTop: 10

    },
    locationBtn: {

        // marginTop: 3
        //justifyContent: 'flex-start',
        // borderWidth: 0,
        // backgroundColor: 'red'


    },

})
