import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

const InputField = ({ value, onChangeText, placeholder, secureTextEntry, rightIcon, onRightIconPress }) => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.iconWrap}>
          {/* <Icon name={rightIcon} size={22} color="#333" /> */}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: colors.inputBg,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary },
  iconWrap: { marginLeft: 12 },
});

export default InputField;