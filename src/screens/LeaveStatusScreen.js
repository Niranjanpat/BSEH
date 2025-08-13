import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text } from 'react-native-paper';

const ViewLeaveScreen = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave data from API
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/view-leaves'); // Replace with your GET API
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
    fetchLeaves();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { flex: 0.5 }]}>SR.NO</Text>
          <Text style={[styles.cell, styles.headerCell]}>TITLE</Text>
          <Text style={[styles.cell, styles.headerCell]}>REASON</Text>
          <Text style={[styles.cell, styles.headerCell]}>SDATE</Text>
          <Text style={[styles.cell, styles.headerCell]}>EDATE</Text>
          <Text style={[styles.cell, styles.headerCell]}>STATUS</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : leaves.length > 0 ? (
          leaves.map((item, index) => (
            <View key={item.id || index} style={styles.row}>
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={styles.cell}>{item.reason}</Text>
              <Text style={styles.cell}>{item.startDate}</Text>
              <Text style={styles.cell}>{item.endDate}</Text>
              <Text
                style={[
                  styles.cell,
                  { color: item.status === 'Approved' ? 'green' : item.status === 'Rejected' ? 'red' : 'orange' },
                ]}
              >
                {item.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', paddingVertical: 20 }}>No leave records found</Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 8,
    padding: 0,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#3498db',
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default ViewLeaveScreen;