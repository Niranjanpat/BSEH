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
import {Picker} from '@react-native-picker/picker';
import {COLORS} from '../../../constants/theme/colors';
import {
  updateUserComplaint,
  getComplaintsType,
} from '../../../services/complaint_service';

const UpdateComplaintScreen = ({route, navigation}) => {
  const {complaint, id} = route.params;
  const [subject, setSubject] = useState('');
  const [remark, setRemark] = useState('');
  const [complaintTypeSelected, setComplaintTypeSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const [complaintType, setComplaintType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchComplaintTypes();
  }, []);

  useEffect(() => {
    setSubject(complaint?.subject ?? '');
    setRemark(complaint?.remarks ?? '');
    setComplaintTypeSelected(complaint?.complaint_type_id ?? null);
    setStatus(complaint?.status);
  }, [complaint, complaintType]);

  const fetchComplaintTypes = async () => {
    try {
      const res = await getComplaintsType();
      const {data, success, errors} = res?.data;

      if (success) {
        setComplaintType(data.complaint_types || []);
      } else {
        console.log('Complaint type error:', errors);
        if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      }
    } catch (error) {
      console.log('getComplaintTypes error:', error);
    }
  };

  const resetForm = () => {
    setSubject('');
    setRemark('');
    setComplaintTypeSelected(null);
    setStatus(null);
  };

  const onSubmit = async () => {
    if (!subject || !remark || !complaintTypeSelected) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }

    const data = {
      subject: subject,
      remarks: remark,
      complaint_type_id: complaintTypeSelected,
      status: status,
    };

    try {
      const res = await updateUserComplaint(data, id);

      const {success, errors} = res.data;

      if (success) {
        Alert.alert('Success', `Complaint updated successfully`);
        navigation.goBack();
      } else if (errors) {
        console.log(errors);
        Alert.alert('Error', Object.values(errors).join(', '));
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
          <Text style={styles.label}>Select Complaint Types</Text>
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
        <View style={styles.containerWrap}>
          <View style={styles.container}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={status}
                onValueChange={itemValue => setStatus(itemValue)}
                style={styles.picker}
                dropdownIconColor="#333"
                mode="dropdown">
                <Picker.Item label="Select Status" value="" color="#888" />
                <Picker.Item label="Open" value="open" />
                <Picker.Item label="Closed" value="closed" />
              </Picker>
            </View>
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

export default UpdateComplaintScreen;

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
