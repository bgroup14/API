import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import FontAwsome from 'react-native-vector-icons/FontAwesome';

const TextArea = ({ labelValue, placeholderText, iconType, ...rest }) => {


  return (
    <View style={styles.inputContainer}>
      {/* <View style={styles.iconStyle}>
        <FontAwsome name={iconType} size={25} color="#666" />
      </View> */}
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
    marginTop: 5,
    marginBottom: 10,
    width: '98%',
    height: windowHeight / 8,
    borderColor: '#ccc',
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#fff',


  },
  input: {

    padding: 10,
    fontSize: 16,
    // fontFamily: 'Lato-Regular',
    textAlignVertical: 'top'

  },

});
