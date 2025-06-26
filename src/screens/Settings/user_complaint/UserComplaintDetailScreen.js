import {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {getUserComplaintDetail} from '../../../services/complaint_service';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ROUTES} from '../../../constants/routes';

const UserComplaintDetailScreen = ({route}) => {
  const {complaint} = route.params;
  const id = complaint._id;
  const [complaintDetail, setComplaintDetail] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useLayoutEffect(() => {
    if (complaint.status === 'open') {
      navigation.setOptions({
        title: 'Complaint Details',
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.update_user_complaint, {
                complaint: complaintDetail,
                id: id,
              })
            }
            style={styles.headerIcon}>
            <Icon name="edit" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, complaintDetail]);

  useEffect(() => {
    fetchUserComplaintDetail();
  }, []);
  
  const fetchUserComplaintDetail = async () => {
    try {
      const res = await getUserComplaintDetail(id);
      const {data, success, errors} = res?.data;
      if (success) {
        setComplaintDetail(data);
      } else {
          Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('getComplaintDetail', error);
    }
  };

  const renderItem = (iconName, label, value) => (
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Icon
          name={iconName}
          size={20}
          color={theme.colors.primary}
          style={styles.itemIcon}
        />
        <Text style={[styles.itemLabel, {color: theme.colors.primary}]}>
          {label}
        </Text>
      </View>
      <Text style={styles.itemValue}>{value || '-'}</Text>
    </View>
  );

  if (!complaintDetail) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {renderItem('subject', 'Subject', complaintDetail.subject)}
        {renderItem('flag', 'Status', complaintDetail.status)}
        {renderItem(
          'category',
          'Complaint Type',
          complaintDetail.complaint_type_name,
        )}
        {renderItem('event', 'Created At', complaintDetail.created_at)}
        {renderItem('notes', 'Remarks', complaintDetail.remarks)}
        {renderItem('person', 'Customer Name', complaintDetail.customer_name)}
        {renderItem('location-on', 'Address', complaintDetail.customer_address)}
        {renderItem('location-city', 'City', complaintDetail.customer_city)}
        {renderItem('place', 'District', complaintDetail.customer_district)}
        {renderItem('map', 'State', complaintDetail.customer_state)}
        {renderItem('pin', 'Pin Code', complaintDetail.customer_pin_code)}
        {renderItem('qr-code', 'SAP Code', complaintDetail.customer_sap_code)}
        {renderItem('alt-route', 'Route', complaintDetail.customer_route)}
        {renderItem('public', 'Region', complaintDetail.customer_region)}
        {renderItem('badge', 'Created By', complaintDetail.created_by_name)}
        {renderItem('work', 'Role', complaintDetail.created_by_role)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 40,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  itemIcon: {
    marginRight: 6,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 15,
    color: '#333',
    maxWidth: '40%',
    textAlign: 'right',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
});

export default UserComplaintDetailScreen;
