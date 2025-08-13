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
    { empName: 'Emily Davis', deptName: 'Marketing', request: 'Car Loan' },
    { empName: 'David Wilson', deptName: 'Operations', request: 'Medical Loan' },
    { empName: 'Sophia Brown', deptName: 'Finance', request: 'Vacation Loan' },
    { empName: 'Liam Johnson', deptName: 'HR', request: 'Wedding Loan' },
    { empName: 'Olivia Taylor', deptName: 'IT', request: 'Startup Loan' },
    { empName: 'Noah Anderson', deptName: 'Sales', request: 'Mortgage Loan' },
    { empName: 'Isabella Thomas', deptName: 'Legal', request: 'Business Loan' },
    { empName: 'James Martinez', deptName: 'Finance', request: 'Personal Loan' },
    { empName: 'Ava Robinson', deptName: 'HR', request: 'Education Loan' },
    { empName: 'Ethan Garcia', deptName: 'IT', request: 'Car Loan' },
    { empName: 'Mia Clark', deptName: 'Operations', request: 'Medical Loan' },
    { empName: 'Lucas Rodriguez', deptName: 'Marketing', request: 'Vacation Loan' },
    { empName: 'Charlotte Lewis', deptName: 'Finance', request: 'Wedding Loan' },
    { empName: 'Benjamin Walker', deptName: 'IT', request: 'Startup Loan' },
    { empName: 'Amelia Hall', deptName: 'Legal', request: 'Mortgage Loan' },
    { empName: 'William Allen', deptName: 'Sales', request: 'Business Loan' },
    { empName: 'Harper Young', deptName: 'HR', request: 'Home Loan' },
  ];

  const displayData = loanData.length > 0 ? loanData : sampleData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} elevation={2}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText, { flex: 0.6 }]}>SR.NO</Text>
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
                {
                  backgroundColor: index % 2 === 0 ? '#f5f8ff' : '#ffffff',
                },
              ]}
            >
              <Text style={[styles.cell, { flex: 0.6 }]}>{index + 1}</Text>
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
    backgroundColor: COLORS.background,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: COLORS.primary || '#3498db',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ViewLoanScreen;
