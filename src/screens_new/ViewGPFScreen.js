import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const ViewGpaScreen = () => {
  const [gpaList, setGpaList] = useState([
    { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
     { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
     { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
     { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
     { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
     { date: '2025-01-05', amount: 5000, interest: 5.5, recovery: 1000, totalAmount: 5250, pending: 4250 },
    { date: '2025-02-10', amount: 12000, interest: 6.2, recovery: 4000, totalAmount: 12744, pending: 8744 },
    { date: '2025-03-15', amount: 25000, interest: 4.8, recovery: 8000, totalAmount: 26200, pending: 18200 },
    { date: '2025-04-20', amount: 15000, interest: 5.0, recovery: 5000, totalAmount: 15750, pending: 10750 },
  ]);

  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const screenHeight = Dimensions.get('window').height;

  const fetchGpaData = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://example.com/api/view-gpa'); // Replace with real API
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
    // fetchGpaData();
  }, []);

  const rowsMaxHeight = screenHeight - headerHeight - 150; 
  // 150 is padding + card margin + possible top bar height; adjust if needed

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header */}
            <View
              style={[styles.row, styles.headerRow]}
              onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
              <Text style={[styles.headerCell, { width: 60 }]}>SR.NO</Text>
              <Text style={[styles.headerCell, { width: 100 }]}>DATE</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>AMOUNT</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>INTEREST</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>RECOVERY</Text>
              <Text style={[styles.headerCell, { width: 150 }]}>TOTAL AMOUNT</Text>
              <Text style={[styles.headerCell, { width: 150 }]}>PENDING</Text>
            </View>

            {/* Table Rows */}
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: rowsMaxHeight }}
            >
              {loading ? (
                <ActivityIndicator style={{ marginVertical: 20 }} />
              ) : gpaList.length > 0 ? (
                gpaList.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.row,
                      { backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f7f9fc' },
                    ]}
                  >
                    <Text style={[styles.cell, { width: 60 }]}>{index + 1}</Text>
                    <Text style={[styles.cell, { width: 100 }]}>{item.date}</Text>
                    <Text style={[styles.cell, { width: 120, color: COLORS.primary, fontWeight: '600' }]}>
                      ₹{item.amount.toLocaleString()}
                    </Text>
                    <Text style={[styles.cell, { width: 120, color: '#27ae60', fontWeight: '500' }]}>
                      {item.interest}%
                    </Text>
                    <Text style={[styles.cell, { width: 120 }]}>
                      {item.recovery.toLocaleString()}
                    </Text>
                    <Text style={[styles.cell, { width: 150 }]}>
                      {item.totalAmount.toLocaleString()}
                    </Text>
                    <Text style={[styles.cell, { width: 150 }]}>
                      {item.pending.toLocaleString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', paddingVertical: 20 }}>
                  No GPA records found
                </Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.background,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    alignSelf: 'stretch',
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
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 13,
    flexWrap: 'wrap',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ViewGpaScreen;
