import React from 'react';
import { Image, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

const GooglePlacesInput = () => {
    return (
        <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder='Search'
            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
            }}
            query={{
                key: 'AIzaSyCgDOM0GzIj6iifoTUYqNlQ1-Cs15VNhiU',
                language: 'en',
            }}
            predefinedPlaces={[homePlace, workPlace]}
        />
    );
};

export default GooglePlacesInput;