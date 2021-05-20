import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';

const PublishPostTextArea = ({ labelValue, placeholderText, iconType, ...rest }) => {


  return (
    <View style={styles.inputContainer}>

      <TextInput
        value={labelValue}
        style={styles.input}
        multiline={true}
        placeholder={placeholderText}
        placeholderTextColor="black"
        {...rest}
        maxLength={500}
      />
    </View>
  );
};

export default PublishPostTextArea;

const styles = StyleSheet.create({
  inputContainer: {

    width: windowWidth / 1.081,
    height: windowHeight / 6,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginTop: windowHeight / 40,
    borderRadius: 3



  },
  input: {

    padding: 10,
    fontSize: 16,
  },

});
