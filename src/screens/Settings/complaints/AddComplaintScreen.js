import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import {COLORS} from '../../../constants/theme/colors';
import {
  addComplaints,
  updateComplaints,
  getComplaintsType,
} from '../../../services/complaint_service';

const AddComplaintScreen = ({route, navigation}) => {
  const {channel, complaint} = route.params;

  const [subject, setSubject] = useState('');
  const [remark, setRemark] = useState('');
  const [complaintTypeSelected, setComplaintTypeSelected] = useState(null);
  const [complaintType, setComplaintType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComplaintTypes();
  }, []);

  useEffect(() => {
    if (channel === 'update' && complaint) {
      setSubject(complaint.subject || '');
      setRemark(complaint.remark || '');
      setComplaintTypeSelected(complaint.complaint_type || null);
    }
  }, [channel, complaint]);

  const fetchComplaintTypes = async () => {
    try {
      const res = await getComplaintsType();
      const {data, success, errors} = res?.data;

      if (success) {
        console.log(data);
        setComplaintType(data.complaint_types || []);
      } else {
        console.log('Complaint type error:', errors);
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getComplaintTypes error:', error);
    }
  };

  const resetForm = () => {
    setSubject('');
    setRemark('');
    setComplaintTypeSelected(null);
  };

  const onSubmit = async () => {
    if (!subject || !remark || !complaintTypeSelected) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }

    const data = {
      subject: subject,
      remarks: remark,
      complaint_type_id: complaintTypeSelected,
      customer_id: '',
    };
    console.log(data);
    setIsLoading(true);

    try {
      const res =
        channel === 'update'
          ? await updateComplaints(data, id)
          : await addComplaints(data);

      const {success, errors} = res.data;

      if (success) {
        Alert.alert(
          'Success',
          `Complaint ${
            channel === 'update' ? 'updated' : 'added'
          } successfully`,
        );
        if (channel === 'add') resetForm();
        navigation.goBack();
      } else {
        console.log(errors);
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.containerWrap}>
        <View style={styles.container}>
          <Text style={styles.label}>{channel}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={complaintTypeSelected}
              onValueChange={itemValue => setComplaintTypeSelected(itemValue)}
              style={styles.picker}
              dropdownIconColor="#333"
              mode="dropdown">
              <Picker.Item label={'Complaints Types'} value="" color="#888" />
              {complaintType.map((option, index) => (
                <Picker.Item
                  key={option._id}
                  label={option.name}
                  value={option._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor="#888"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Remark</Text>
          <TextInput
            style={[styles.input, styles.remarkInput]}
            placeholder="Remark"
            placeholderTextColor="#888"
            multiline
            value={remark}
            onChangeText={setRemark}
          />
        </View>

        <View style={[styles.container, {marginBottom: 20}]}>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}>
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddComplaintScreen;

const styles = StyleSheet.create({
  containerWrap: {
    flexDirection: 'column',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
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
  remarkInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
    container: {
      paddingHorizontal: 20,
      paddingVertical: 5,
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
