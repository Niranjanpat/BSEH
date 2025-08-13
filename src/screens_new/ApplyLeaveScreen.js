import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme/colors';

const ApplyLeaveScreen = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [leavePurpose, setLeavePurpose] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Fetch leave types from API
  const fetchLeaveTypes = async () => {
    try {
      setLoadingTypes(true);
      const res = await fetch('https://example.com/api/leave-types'); // Replace with your API
      const data = await res.json();

      if (res.ok) {
        setLeaveTypes(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch leave types');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fetch leave types');
      console.error(err);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Submit leave application
  const applyLeave = async () => {
    if (!selectedLeaveType || !leavePurpose || !leaveReason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/apply-leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveTypeId: selectedLeaveType, // _id from dropdown
          leavePurpose,
          leaveReason,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Leave application submitted successfully');
        setLeavePurpose('');
        setLeaveReason('');
        setSelectedLeaveType(null);
      } else {
        Alert.alert('Error', data.message || 'Failed to apply leave');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while applying leave');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Apply for Leave</Text>

        {/* Leave Type Dropdown */}
        {loadingTypes ? (
          <ActivityIndicator style={{ marginVertical: 10 }} />
        ) : (
          <View style={styles.dropdown}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type._id}
                style={[
                  styles.dropdownItem,
                  selectedLeaveType === type._id && styles.dropdownSelected,
                ]}
                onPress={() => setSelectedLeaveType(type._id)}
              >
                <Text style={{ color: selectedLeaveType === type._id ? '#fff' : '#000' }}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Leave Purpose */}
        <TextInput
          label="Leave Purpose"
          mode="outlined"
          value={leavePurpose}
          onChangeText={setLeavePurpose}
          style={styles.input}
        />

        {/* Start Date */}
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <TextInput
            label="Start Date"
            mode="outlined"
            value={startDate.toDateString()}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End Date */}
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <TextInput
            label="End Date"
            mode="outlined"
            value={endDate.toDateString()}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* Leave Reason */}
        <TextInput
          label="Leave Reason"
          mode="outlined"
          value={leaveReason}
          onChangeText={setLeaveReason}
          style={styles.input}
          multiline
        />

        {/* Apply Now Button */}
        <Button
          mode="contained"
          onPress={applyLeave}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Apply Now
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: COLORS.background,
  },
  card: {
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  dropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  dropdownSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
});

export default ApplyLeaveScreen;