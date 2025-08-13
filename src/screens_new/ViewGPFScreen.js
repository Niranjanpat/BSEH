import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const ViewGpaScreen = () => {
  const [gpaList, setGpaList] = useState([
    { date: '2025-01-05', amount: 5000, interest: 5.5, request: 'Personal Loan' },
    { date: '2025-01-10', amount: 12000, interest: 6.2, request: 'Education Loan' },
    { date: '2025-01-15', amount: 25000, interest: 4.8, request: 'Home Loan' },
    { date: '2025-02-01', amount: 15000, interest: 5.0, request: 'Car Loan' },
    { date: '2025-02-05', amount: 8000, interest: 7.1, request: 'Medical Loan' },
    { date: '2025-02-10', amount: 7000, interest: 6.0, request: 'Vacation Loan' },
    { date: '2025-02-15', amount: 9000, interest: 5.9, request: 'Wedding Loan' },
    { date: '2025-03-01', amount: 20000, interest: 6.5, request: 'Startup Loan' },
    { date: '2025-03-05', amount: 30000, interest: 4.5, request: 'Mortgage Loan' },
    { date: '2025-03-10', amount: 40000, interest: 5.2, request: 'Business Loan' },
    { date: '2025-03-15', amount: 5500, interest: 5.7, request: 'Personal Loan' },
    { date: '2025-04-01', amount: 13000, interest: 6.3, request: 'Education Loan' },
    { date: '2025-04-05', amount: 16000, interest: 5.4, request: 'Car Loan' },
    { date: '2025-04-10', amount: 9500, interest: 7.0, request: 'Medical Loan' },
    { date: '2025-04-15', amount: 8500, interest: 6.1, request: 'Vacation Loan' },
    { date: '2025-05-01', amount: 10000, interest: 5.8, request: 'Wedding Loan' },
    { date: '2025-05-05', amount: 22000, interest: 6.4, request: 'Startup Loan' },
    { date: '2025-05-10', amount: 28000, interest: 4.9, request: 'Mortgage Loan' },
    { date: '2025-05-15', amount: 35000, interest: 5.3, request: 'Business Loan' },
    { date: '2025-05-20', amount: 5200, interest: 5.6, request: 'Home Loan' },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchGpaData = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/view-gpa'); // Replace with your real GET API
      const data = await res.json();

      if (res.ok) {
        setGpaList(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch GPA data');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fetch GPA data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGpaData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 0.5 }]}>SR.NO</Text>
          <Text style={[styles.cell, styles.headerCell]}>DATE</Text>
          <Text style={[styles.cell, styles.headerCell]}>AMOUNT</Text>
          <Text style={[styles.cell, styles.headerCell]}>INTEREST</Text>
          <Text style={[styles.cell, styles.headerCell]}>REQUEST</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : gpaList.length > 0 ? (
          gpaList.map((item, index) => (
            <View
              key={item.id || index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' },
              ]}
            >
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={[styles.cell, { color: COLORS.primary, fontWeight: '600' }]}>
                ₹{item.amount.toLocaleString()}
              </Text>
              <Text style={[styles.cell, { color: '#27ae60', fontWeight: '500' }]}>
                {item.interest}%
              </Text>
              <Text style={[styles.cell, { fontStyle: 'italic', color: '#555' }]}>
                {item.request}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', paddingVertical: 20 }}>No GPA records found</Text>
        )}
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
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  headerRow: {
    backgroundColor: COLORS.primary,
  },
  cell: {
    flex: 1,
    fontSize: 13,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default ViewGpaScreen;
