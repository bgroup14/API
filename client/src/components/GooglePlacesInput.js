import React from 'react';
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
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            styles={{
                textInputContainer: {
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

                textInput: {
                    marginLeft: 6,
                    color: 'black',
                    fontSize: 16,
                },
                predefinedPlacesDescription: {
                    color: 'pink',
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

            }}
            query={{
                key: 'AIzaSyDD3Ph5rVSvK3KGil9kbxdbp3abI0vwH1A',
                language: 'en',
            }}
        />

    );
};


export default GooglePlacesInput;