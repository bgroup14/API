import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements'
import axios from 'axios';
import FormButton from '../components/FormButton';
import { Button } from 'react-native';

const HobbiesScreen = (props) => {
  
  const [hobbies, setHobbies] = useState([]);
  const [initialHobbies, setInitialHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selected, setSelected] = useState();
  const hobbiesFetchURL = `http://proj.ruppin.ac.il/bgroup14/prod/api/hobbies`

  useEffect(() => {
    const fetchHobbies = async () => {
      console.log("fetching data..............");
    const result = await axios(
        hobbiesFetchURL
      );
      setHobbies(result.data);
      setInitialHobbies(result.data);
      setSelectedHobbies([]);
    };
    fetchHobbies();
}, []);

const hobbyCheck = (hobby) => {
    //console.log("Got hobby (ID: "+hobby.id+"): "+hobby.name);
    // setSelectedHobbies([...selectedHobbies, hobby]);
    // console.log("Array count: "+selectedHobbies.length);
    if (selectedHobbies.includes(hobby)) {
      //console.log("hobby is INCLUDED");
      setSelectedHobbies(selectedHobbies.filter(function(el) { return el.id != hobby.id; }));
    }
    else {
      //console.log("hobby not included");
      setSelectedHobbies([...selectedHobbies, hobby]);
    }

}

const hobbyCheckSelected = (hobby) => {
  return (selectedHobbies.includes(hobby));
}

const onChangeText = (searchText) => {
  setHobbies(initialHobbies.filter(function(el) { return el.name.includes(searchText); }));
  if (hobbies.length <= 0 || searchText.length <= 0) {
    setHobbies(initialHobbies);
  }
}


const saveHobbies = () => {
  //dispatch(saveHobbies(selectedHobbies));

}

  return (
    <View>
        <ScrollView>
        <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        onChangeText={text => onChangeText(text)}
        placeholder="Search Hobby"
      />
      <FormButton
        buttonTitle="Save"
        onPress={() => saveHobbies()}
      />
        <View style={styles.radioBtnContainer}>
          {typeof(hobbies) !== 'undefined' && hobbies.length > 0 && hobbies.map((hobby) => (
                    <CheckBox
                    title={hobby.name}
                    key={hobby.id}
                    // onPress={() => selected != hobby.id ? setSelected(hobby.id) : setSelected(null)}
                    checked={ hobbyCheckSelected(hobby) }
                    // onPress={() => selectedHobbies.some(item => item.id === hobby.id) ? setSelectedHobbies(...selectedHobbies) : setSelectedHobbies([...selectedHobbies, hobby])}
                    onPress={() => hobbyCheck(hobby) }
                  />
                ))}

        </View>
      </ScrollView>
    </View>
  );
};

export default HobbiesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    alignItems: 'center',
    padding: 15,

  },
  radioBtnContainer: {
    // flexDirection: 'row',
    //flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#ccc',
    //justifyContent: 'flex-start',
    marginVertical: 15,
    width: '100%',



  }
  ,
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
  imageContainer: {
    padding: 20
  },
  button: {

  }


});