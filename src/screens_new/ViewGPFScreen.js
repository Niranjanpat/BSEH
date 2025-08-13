import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const ViewGpaScreen = () => {
  const [gpaList, setGpaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch GPA data from API
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
            <View key={item.id || index} style={styles.row}>
              <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.amount}</Text>
              <Text style={styles.cell}>{item.interest}</Text>
              <Text style={styles.cell}>{item.request}</Text>
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

export default ViewGpaScreen;