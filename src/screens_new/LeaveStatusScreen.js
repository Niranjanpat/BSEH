import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const ViewLeaveScreen = () => {
  const [leaves, setLeaves] = useState([
    { title: 'Project Alpha', reason: 'Requirement Gathering', sDate: '2025-01-05', eDate: '2025-01-10', status: 'Completed' },
    { title: 'System Upgrade', reason: 'Server Maintenance', sDate: '2025-02-01', eDate: '2025-02-05', status: 'In Progress' },
    { title: 'Website Revamp', reason: 'UI/UX Improvements', sDate: '2025-03-10', eDate: '2025-03-20', status: 'Pending' },
    { title: 'Training Session', reason: 'Skill Development', sDate: '2025-04-15', eDate: '2025-04-16', status: 'Completed' },
    { title: 'Audit Review', reason: 'Annual Compliance', sDate: '2025-05-01', eDate: '2025-05-03', status: 'In Progress' },
    { title: 'Marketing Campaign', reason: 'Product Launch', sDate: '2025-05-15', eDate: '2025-05-30', status: 'Pending' },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/view-leaves');
      const data = await res.json();

      if (res.ok) {
        setLeaves(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch leaves');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fetch leaves');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchLeaves(); // API call disabled for demo
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'In Progress':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'Pending':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 0.5 }]}>SR.No</Text>
          <Text style={[styles.cell, styles.headerCell]}>Title</Text>
          <Text style={[styles.cell, styles.headerCell]}>Reason</Text>
          <Text style={[styles.cell, styles.headerCell]}>Start</Text>
          <Text style={[styles.cell, styles.headerCell]}>End</Text>
          <Text style={[styles.cell, styles.headerCell]}>Status</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : leaves.length > 0 ? (
          leaves.map((item, index) => (
            <View
              key={item.id || index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f7f9fc' },
              ]}
            >
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={styles.cell}>{item.reason}</Text>
              <Text style={styles.cell}>{item.sDate}</Text>
              <Text style={styles.cell}>{item.eDate}</Text>
              <Text
                style={[
                  styles.cell,
                  styles.statusPill,
                  {
                    backgroundColor: getStatusStyle(item.status).backgroundColor,
                    color: getStatusStyle(item.status).color,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', paddingVertical: 20 }}>
            No leave records found
          </Text>
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
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: COLORS.primary || '#3498db',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 13,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  statusPill: {
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 3,
    overflow: 'hidden',
  },
});

export default ViewLeaveScreen;
