import {StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';

const InputText = ({placeholder, keyboardType, onChangeText}) => {
  const [value, setValue] = useState('');
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      keyboardType={keyboardType}
      onChangeText={v => {
        setValue(v);
        onChangeText(v);
      }}
    />
  );
};

export default InputText;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
});
