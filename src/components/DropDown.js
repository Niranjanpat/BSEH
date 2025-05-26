import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MyDropdown =({setSelectedOption ,selectedOption, item, channel}) => {


  return (
    <View style={styles.container}>
      <Text style={styles.label}>{channel}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
          style={styles.picker}
          dropdownIconColor="#333"
          mode="dropdown"
        >
          <Picker.Item label={channel} value="" color="#888" />
          {item.map((option, index) => (
            <Picker.Item key={option._id} label={option.text} value={option._id} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
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
    color: '#000',
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    color: '#444',
  },
});

export default MyDropdown;
