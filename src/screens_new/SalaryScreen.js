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
  const [creating, setCreating] = useState(false);
  const [htmlContent, setHtmlContent] = useState(`
  <div style="font-family: Arial, sans-serif; padding: 10px;">
    <h2 style="text-align: center; color: #2c3e50;">Salary Slip - January 2025</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr style="background-color: #3498db; color: white;">
        <th style="padding: 8px; border: 1px solid #ccc;">Earnings</th>
        <th style="padding: 8px; border: 1px solid #ccc;">Amount</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">Basic Pay</td>
        <td style="padding: 8px; border: 1px solid #ccc;">$2000</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">House Rent Allowance</td>
        <td style="padding: 8px; border: 1px solid #ccc;">$800</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">Medical Allowance</td>
        <td style="padding: 8px; border: 1px solid #ccc;">$200</td>
      </tr>
      <tr style="background-color: #ecf0f1;">
        <td style="padding: 8px; border: 1px solid #ccc;"><b>Total Earnings</b></td>
        <td style="padding: 8px; border: 1px solid #ccc;"><b>$3000</b></td>
      </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr style="background-color: #e74c3c; color: white;">
        <th style="padding: 8px; border: 1px solid #ccc;">Deductions</th>
        <th style="padding: 8px; border: 1px solid #ccc;">Amount</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">Tax</td>
        <td style="padding: 8px; border: 1px solid #ccc;">$200</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">Provident Fund</td>
        <td style="padding: 8px; border: 1px solid #ccc;">$150</td>
      </tr>
      <tr style="background-color: #ecf0f1;">
        <td style="padding: 8px; border: 1px solid #ccc;"><b>Total Deductions</b></td>
        <td style="padding: 8px; border: 1px solid #ccc;"><b>$350</b></td>
      </tr>
    </table>

    <h3 style="text-align: right; margin-top: 20px; color: #27ae60;">
      Net Salary: $2650
    </h3>
  </div>
`);

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

  // Android 11+ (API 30+) does NOT need WRITE_EXTERNAL_STORAGE (it’s ignored).
  // We only request permissions on Android 10 and below for compatibility.
  const requestStoragePermissionIfNeeded = async () => {
    if (Platform.OS !== 'android') return true;
    const apiLevel = Platform.Version; // number on Android

    if (apiLevel >= 30) {
      // Scoped storage — no legacy write permission required
      return true;
    }

    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      const writeGranted =
        result[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const readGranted =
        result[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (!writeGranted || !readGranted) {
        Alert.alert(
          'Permission Required',
          'Please allow storage permissions to save the PDF on your device.'
        );
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Permission request error:', e);
      return false;
    }
  };

  const createPDF = async () => {
    try {
      if (!htmlContent) {
        Alert.alert('No Data', 'No HTML content to generate PDF');
        return;
      }

      const hasPermission = await requestStoragePermissionIfNeeded();
      if (!hasPermission) return;

      setCreating(true);

      const fileName = `Salary_${selectedYear || 'Year'}_${selectedMonth || 'Month'}`;

      const options = {
        html: htmlContent,
        fileName,
        // Save to Downloads on Android (visible to user), Documents on iOS
        directory: Platform.OS === 'android' ? 'Download' : 'Documents',
        base64: false,
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (!file || !file.filePath) {
        setCreating(false);
        Alert.alert('Error', 'Failed to generate PDF file path.');
        return;
      }

      Alert.alert('PDF Created', 'PDF has been saved successfully.', [
        {
          text: 'Open',
          onPress: () => {
            FileViewer.open(file.filePath, { showOpenWithDialog: true }).catch((error) => {
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
                failOnCancel: false,
              });
            } catch (error) {
              console.error('Share Error:', error);
            }
          },
        },
        { text: 'Close', style: 'cancel' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const isActionDisabled = loading || creating;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Salary Slip</Text>
        <Text style={styles.subtitle}>Generate & preview your monthly salary slip</Text>

        <View style={styles.row}>
          <View style={styles.column}>
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
          </View>

          <View style={styles.column}>
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
          </View>
        </View>

        <Button
          mode="contained"
          style={[styles.fetchButton, isActionDisabled && styles.disabledButton]}
          onPress={fetchData}
          disabled={isActionDisabled}
        >
          {loading ? 'Fetching...' : 'Fetch Salary Data'}
        </Button>
      </Card>

      {(loading || creating) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            {loading ? 'Loading data…' : 'Creating PDF…'}
          </Text>
        </View>
      )}

      {htmlContent ? (
        <>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewHint}>Scroll to review before saving</Text>
          </View>

          <ScrollView style={styles.htmlContainer} contentContainerStyle={{ paddingBottom: 12 }}>
            <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
          </ScrollView>

          <TouchableOpacity
            style={[styles.pdfButton, isActionDisabled && styles.pdfButtonDisabled]}
            onPress={createPDF}
            disabled={isActionDisabled}
            activeOpacity={0.9}
          >
            <Text style={styles.pdfButtonText}>
              {creating ? 'Creating…' : 'Create & Download PDF'}
            </Text>
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
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    fontSize: 15,
    color: '#374151',
  },
  pickerWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  fetchButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  previewHeader: {
    marginTop: 16,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  previewHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  htmlContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pdfButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  pdfButtonDisabled: {
    opacity: 0.7,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 90,
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadingText: {
    fontSize: 12,
    color: '#374151',
  },
});

export default SalaryScreen;
