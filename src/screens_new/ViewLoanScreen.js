import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const ViewLoanScreen = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoanData = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/view-loans'); // Replace with your API
      const data = await res.json();

      if (res.ok) {
        setLoanData(data);
      } else {
        console.error(data.message || 'Failed to fetch loans');
      }
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanData();
  }, []);

  // Static data fallback (for demo)
  const sampleData = [
    { empName: 'John Doe', deptName: 'Finance', request: 'Personal Loan' },
    { empName: 'Jane Smith', deptName: 'HR', request: 'Education Loan' },
    { empName: 'Michael Lee', deptName: 'IT', request: 'Home Loan' },
  ];

  const displayData = loanData.length > 0 ? loanData : sampleData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} elevation={3}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText, { flex: 0.5 }]}>SR.NO</Text>
          <Text style={[styles.cell, styles.headerText]}>EMP NAME</Text>
          <Text style={[styles.cell, styles.headerText]}>DEPARTMENT NAME</Text>
          <Text style={[styles.cell, styles.headerText]}>REQUEST</Text>
        </View>

        {/* Table Body */}
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          displayData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' },
              ]}
            >
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={styles.cell}>{item.empName}</Text>
              <Text style={styles.cell}>{item.deptName}</Text>
              <Text style={styles.cell}>{item.request}</Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor:COLORS.background,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  headerRow: {
    backgroundColor: '#3498db',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ViewLoanScreen;