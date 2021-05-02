import React from 'react';
import { Fragment } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { windowHeight, windowWidth } from '../../utils/Dimentions';


const GooglePlacesInput = (props) => {

    const sendData = (data, details) => {
        props.getCityName(data.description)
        if (props.meeting) {
            console.log(data.structured_formatting.main_text)
            let coordinates = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                locationLabel: data.structured_formatting.main_text
            }
            props.sendCoordinatesObj(coordinates)
            console.log(details.geometry.location.lat)
            console.log(details.geometry.location.lng)
        }
    }
    return (

        <GooglePlacesAutocomplete
            suppressDefaultStyles={true}
            placeholder={props.currentCity != undefined ? props.currentCity : 'Enter city name'}
            minLength={3}
            enablePoweredByContainer={false}
            // numberOfLines={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            styles={{
                textInputContainer: {
                    //  borderColor: '#ccc',
                    // borderWidth: 2,
                    // height: 40,
                    // width: "98%",
                    //marginLeft: 30,
                    //  backgroundColor: 'white',
                    marginTop: 5,
                    marginBottom: 10,
                    width: windowWidth / 1.1,
                    height: windowHeight / 15,
                    borderColor: '#ccc',
                    borderRadius: 15,
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',


                },
                // poweredContainer: {
                //     marginTop: 1
                //     justifyContent: 'flex-end',
                //     alignItems: 'center',
                //     borderBottomRightRadius: 5,
                //     borderBottomLeftRadius: 5,
                //     borderColor: '#c8c7cc',
                //     borderTopWidth: 0.5,
                // },
                textInput: {
                    marginLeft: 6,
                    // height: 88,
                    color: 'black',
                    fontSize: 16,
                },
                predefinedPlacesDescription: {
                    color: 'pink',
                    // color: '#1faadb',
                },
                listView: {
                    height: windowHeight / 6,
                    maxHeight: windowHeight / 9,
                    marginBottom: windowHeight / 90
                },
                row: {
                    backgroundColor: '#FFFFFF',
                    padding: 10,
                    height: 44,
                    flexDirection: 'row',
                },
                separator: {
                    height: 0.5,
                    backgroundColor: '#c8c7cc',
                },
                description: {},
                loader: {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: 20,
                },
            }}
            onPress={(data, details = null) => {
                sendData(data, details)
                // 'details' is provided when fetchDetails = true
                // props.getCityName(data.description)
                //console.log(data)


                //  console.log(data.description);
            }}
            query={{
                key: 'AIzaSyDD3Ph5rVSvK3KGil9kbxdbp3abI0vwH1A',
                language: 'en',
                // components: 'country:us',
            }}
        />

    );
};


export default GooglePlacesInput;