import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import RenderHTML from 'react-native-render-html';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import { COLORS } from '../constants/theme/colors';

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
      Alert.alert('Missing Fields', 'Please select both Year and Month');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://example.com/api/get-data?year=${selectedYear}&month=${selectedMonth}`
      );
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
        Alert.alert('No Data', 'No HTML content to generate PDF');
        return;
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required to create PDF');
          return;
        }
      }

      const fileName = `Salary_${selectedYear}_${selectedMonth}`;
      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert('PDF Created', 'PDF has been saved successfully.', [
        {
          text: 'Open',
          onPress: () => {
            FileViewer.open(file.filePath).catch((error) => {
              Alert.alert('Open Error', 'Unable to open file');
              console.error(error);
            });
          },
        },
        {
          text: 'Share',
          onPress: async () => {
            try {
              await Share.open({
                title: 'Share PDF',
                url: `file://${file.filePath}`,
                type: 'application/pdf',
              });
            } catch (error) {
              console.error('Share Error:', error);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.label}>Select Year</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Year" value="" />
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Month</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Month" value="" />
            {months.map((month) => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
        </View>

        <Button
          mode="contained"
          style={styles.fetchButton}
          onPress={fetchData}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Salary Data'}
        </Button>
      </Card>

      {loading && <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />}

      {htmlContent ? (
        <>
          <ScrollView style={styles.htmlContainer}>
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
    backgroundColor: COLORS.background,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    fontSize: 15,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  fetchButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  htmlContainer: {
    flex: 1,
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  pdfButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SalaryScreen;
