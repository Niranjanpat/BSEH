import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { COLORS } from '../constants/theme/colors';

const LoanScreen = () => {
  const [amount, setAmount] = useState('');
  const [allowance, setAllowance] = useState('');
  const [remark, setRemark] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountTypes, setAccountTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch account types from API
  const fetchAccountTypes = async () => {
    try {
      setLoadingTypes(true);
      const res = await fetch('https://example.com/api/account-types'); // replace with real API
      const data = await res.json();
      if (res.ok) {
        setAccountTypes(
          data.map(item => ({
            id: item._id,
            name: item.label,
          }))
        );
      } else {
        setError(data.message || 'Failed to load account types');
      }
    } catch (err) {
      setError('Something went wrong while loading account types.');
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const handleApplyNow = async () => {
    if (!amount || !allowance || !accountType) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('https://example.com/api/apply-loan', { // replace with real POST API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          allowance,
          accountTypeId: accountType,
          remark,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Loan application submitted successfully!');
        setAmount('');
        setAllowance('');
        setRemark('');
        setAccountType('');
      } else {
        setError(data.message || 'Failed to apply loan.');
      }
    } catch (err) {
      setError('Something went wrong while applying.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Allowance"
        value={allowance}
        onChangeText={setAllowance}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      {loadingTypes ? (
        <ActivityIndicator size="small" color="#3498db" />
      ) : (
        <SearchableDropdown
          onItemSelect={item => setAccountType(item.id)}
          items={accountTypes}
          defaultIndex={
            accountTypes.findIndex(item => item.id === accountType) !== -1
              ? accountTypes.findIndex(item => item.id === accountType)
              : 0
          }
          placeholder="Select Account Type"
          resetValue={false}
          textInputProps={{
            underlineColorAndroid: 'transparent',
            style: {
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              backgroundColor: '#fff',
            },
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
      )}

      <TextInput
        label="Remark"
        value={remark}
        onChangeText={setRemark}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleApplyNow}
        loading={submitting}
        disabled={submitting}
        style={styles.button}
      >
        Apply Now
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoanScreen;
