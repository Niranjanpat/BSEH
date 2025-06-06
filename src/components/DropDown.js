import {View, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useState} from 'react';
import {Text} from 'react-native-paper';

const MyDropdown = ({onOptionChanged, item, channel}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{channel}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => {
            setSelectedOption(itemValue);
            onOptionChanged(itemValue);
          }}
          style={[styles.picker, {color: selectedOption && '#000'}]}
          dropdownIconColor="#333"
          mode="dropdown">
          <Picker.Item label={channel} value={null} color="#888" />
          {item.map((option, index) => (
            <Picker.Item
              key={option._id}
              label={option.text}
              value={option._id}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#888',
  },
});

export default MyDropdown;
