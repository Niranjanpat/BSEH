import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import RenderHTML from 'react-native-render-html';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as OpenAnything from 'react-native-openanything';

const SalaryScreen = () => {
  const { width } = useWindowDimensions();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  const years = Array.from({ length: 10 }, (_, i) => `${new Date().getFullYear() - i}`);
  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const fetchData = async () => {
    if (!selectedYear || !selectedMonth) {
      Alert.alert('Error', 'Please select both Year and Month');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`https://example.com/api/get-data?year=${selectedYear}&month=${selectedMonth}`);
      const data = await res.json();
      if (res.ok) {
        setHtmlContent(data.html || '');
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch data');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createPDF = async () => {
    try {
      if (!htmlContent) {
        Alert.alert('Error', 'No HTML content to generate PDF');
        return;
      }
      let options = {
        html: htmlContent,
        fileName: `Report_${selectedYear}_${selectedMonth}`,
        directory: 'Documents',
      };
      let file = await RNHTMLtoPDF.convert(options);

      Alert.alert(
        'PDF Generated',
        'Your PDF has been created successfully!',
        [
          {
            text: 'Open',
            onPress: () => OpenAnything.Pdf(file.filePath),
          },
          {
            text: 'Share',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(file.filePath);
              }
            },
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.label}>Select Year</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Year" value="" />
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>

        <Text style={styles.label}>Select Month</Text>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Month" value="" />
          {months.map((month) => (
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>

        <Button
          mode="contained"
          style={styles.fetchButton}
          onPress={fetchData}
        >
          Fetch Data
        </Button>
      </Card>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {htmlContent ? (
        <>
          <ScrollView style={{ flex: 1, marginTop: 10 }}>
            <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
          </ScrollView>
          <TouchableOpacity style={styles.pdfButton} onPress={createPDF}>
            <Text style={styles.pdfButtonText}>Create & Download PDF</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  fetchButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
  },
  pdfButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SalaryScreen;