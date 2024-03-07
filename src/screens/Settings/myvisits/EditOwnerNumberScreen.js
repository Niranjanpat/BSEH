import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../../constants/theme/colors';
import {Button, TextInput} from 'react-native-paper';
import {updateCustomerNumber} from '../../../services/activity_service';

const EditOwnerNumberScreen = ({route, navigation}) => {
  const {owner_contact_number, id} = route.params;

  const [contactNumber, setContactNumber] = useState(owner_contact_number);
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);

    updateCustomerNumber(id, contactNumber)
      .then(res => {
        setLoading(false);

        const {success, errors} = res?.data;

        if (success) {
          Alert.alert('Updated', 'Owner number has been updated');
          navigation.goBack();
        } else {
          Alert.alert('Error', JSON.stringify(errors));
        }
      })
      .catch(err => {
        setLoading(false);
        alert(err);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="number-pad"
        style={styles.input}
        mode="outlined"
        label="Owner contact number"
      />
      <Button
        style={styles.button}
        mode="contained"
        disabled={loading}
        loading={loading}
        onPress={handleUpdate}>
        Update
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  button: {
    marginVertical: 10,
  },
});

export default EditOwnerNumberScreen;
