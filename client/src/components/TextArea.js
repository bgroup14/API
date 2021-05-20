import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';

const TextArea = ({ labelValue, placeholderText, iconType, ...rest }) => {


  return (
    <View style={styles.inputContainer}>

      <TextInput
        value={labelValue}
        style={styles.input}
        multiline={true}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        {...rest}
        maxLength={120}
      />
    </View>
  );
};

export default TextArea;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: windowHeight / 100,
    marginBottom: windowHeight / 80,
    width: '98.5%',
    height: windowHeight / 10,
    borderColor: '#ccc',
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',


  },
  input: {

    marginTop: 5,
    marginLeft: 6,
    fontSize: 16,
    // fontFamily: 'Lato-Regular',
    textAlignVertical: 'top'

  },

});
