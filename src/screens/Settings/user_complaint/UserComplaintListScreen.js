import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTheme, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getUserComplaint} from '../../../services/complaint_service';
import {ROUTES} from '../../../constants/routes';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants/theme/colors';
import { userRoles } from '../../../utils/user_roles';

const ROLE_HIERARCHY = [userRoles.SO,
  userRoles.SSO,
  userRoles.ASM,
  userRoles.ZM,
  userRoles.GM,
  userRoles.RM,
  userRoles.VP,];

const UserComplaintListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const today = new Date();
  const {role: userRole} = useSelector(state => state.auth);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  const index = ROLE_HIERARCHY.indexOf(userRole);
  const filteredRoles = ROLE_HIERARCHY.slice(0, index);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setRoleModalVisible(true)}
          style={{paddingHorizontal: 16}}>
          <Icon name="filter-list" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchUserComplaints(1);
    }, [status, startDate, endDate, selectedRole]),
  );

  useEffect(() => {
    complaintsFilteredByRole(selectedRole);
  }, [complaints]);

  const fetchUserComplaints = async (pageNumber = 1) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getUserComplaint({
        start: dayjs(startDate).format('YYYY-MM-DD'),
        end: dayjs(endDate).format('YYYY-MM-DD'),
        page: pageNumber,
        status,
        //  role: selectedRole || undefined,
      });

      const {data, success} = res?.data;
      if (success) {
        const newData = data.complaints || data;
        if (pageNumber === 1) {
          setComplaints(newData);
        } else {
          setComplaints(prev => [...prev, ...newData]);
        }
        setPage(pageNumber + 1);
        setHasMore(newData.length > 0);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };
  const complaintsFilteredByRole = role => {
    setSelectedRole(role);
    if (role === '') {
      setFilteredComplaints(complaints);
    } else {
      const filteredData = complaints.filter(
        item => item.user_role.toLowerCase() === role.toLowerCase(),
      );
      setFilteredComplaints(filteredData);
    }
  };

  const renderItem = ({item}) => {
    const statusColor = item.status === 'closed' ? '#4CAF50' : '#F44336';

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() =>
          navigation.navigate(ROUTES.detail_user_complaint, {complaint: item})
        }>
        <View style={[styles.statusStrip, {backgroundColor: statusColor}]} />
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="subject" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Subject: </Text>
            <Text style={styles.value}>{item.subject}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="person" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Customer: </Text>
            <Text style={styles.value}>{item.customer_name}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="route" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Route: </Text>
            <Text style={styles.value}>{item.customer_route}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="calendar-today"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.label}>Created: </Text>
            <Text style={styles.value}>{item.created_at}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="flag" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusTabs = () => (
    <View style={styles.statusTabs}>
      {['', 'open', 'closed'].map(s => (
        <TouchableOpacity
          key={s}
          style={[
            styles.statusTab,
            status === s && {backgroundColor: theme.colors.primary},
          ]}
          onPress={() => {
            setComplaints([]);
            setPage(1);
            setHasMore(true);
            setStatus(s);
          }}>
          <Text
            style={[
              styles.statusText,
              status === s && {color: '#fff', fontWeight: 'bold'},
            ]}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDatePickers = () => (
    <View style={styles.dateFilter}>
      <TouchableOpacity
        onPress={() => setOpenStart(true)}
        style={styles.dateBtn}>
        <Text style={styles.dateText}>
          Start: {dayjs(startDate).format('YYYY-MM-DD')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setOpenEnd(true)} style={styles.dateBtn}>
        <Text style={styles.dateText}>
          End: {dayjs(endDate).format('YYYY-MM-DD')}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openStart}
        date={startDate}
        onConfirm={date => {
          setOpenStart(false);
          setStartDate(date);
          setComplaints([]);
          setPage(1);
          setHasMore(true);
        }}
        onCancel={() => setOpenStart(false)}
      />
      <DatePicker
        modal
        mode="date"
        open={openEnd}
        date={endDate}
        onConfirm={date => {
          setOpenEnd(false);
          setEndDate(date);
          setComplaints([]);
          setPage(1);
          setHasMore(true);
        }}
        onCancel={() => setOpenEnd(false)}
      />
    </View>
  );
  const renderRoleModal = () => (
    <Modal
      visible={roleModalVisible}
      transparent
      animationType="fade"
      onDismiss={() => {
        setRoleModalVisible(false);
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter by Role</Text>
          <Text style={{marginBottom: 10, color: '#999'}}>
            Your Role:{' '}
            <Text style={{fontWeight: 'bold'}}>{userRole.toUpperCase()}</Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.roleOption,
              selectedRole === '' && {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => {
              // setSelectedRole('');
              // setComplaints([]);
              // setPage(1);
              // setHasMore(true);
              complaintsFilteredByRole('');
              setRoleModalVisible(false);
            }}>
            <Text
              style={[styles.roleText, selectedRole === '' && {color: '#fff'}]}>
              All Roles
            </Text>
          </TouchableOpacity>

          {filteredRoles.map(r => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleOption,
                selectedRole === r && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => {
                // setSelectedRole(r);
                // setComplaints([]);
                // setPage(1);
                // setHasMore(true);
                complaintsFilteredByRole(r);
                setRoleModalVisible(false);
              }}>
              <Text
                style={[
                  styles.roleText,
                  selectedRole === r && {color: '#fff'},
                ]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}

          <Button
            onPress={() => setRoleModalVisible(false)}
            style={{marginTop: 10}}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderDatePickers()}
      {renderStatusTabs()}
      <FlatList
        data={filteredComplaints}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        onEndReached={() => fetchUserComplaints(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      {renderRoleModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  statusStrip: {
    width: 6,
    height: '100%',
  },
  card: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginLeft: 6,
  },
  value: {
    marginLeft: 4,
    flexShrink: 1,
  },
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  statusTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },

  dateFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  dateText: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserComplaintListScreen;
