import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getUserExpenseDetail,
  userExpenseForward,
  userExpenseReject,
} from '../../../services/user_expense';
import {COLORS} from '../../../constants/theme/colors';
import {useSelector} from 'react-redux';
import ExpenseImageModal from '../../../components/ExpenseImageModal';
import { current } from '@reduxjs/toolkit';
import { index } from 'realm';

const STATUS_COLORS = {
  approved: '#28a745',
  rejected: '#dc3545',
  forwarded: COLORS.light,
};

const ROLE_HIERARCHY = [
  'forwarded_by_vp_name',
  'forwarded_by_rm_name',
  'forwarded_by_gm_name',
  'forwarded_by_zm_name',
  'forwarded_by_asm_name',
];

const UserExpenseDetailScreen = ({route}) => {
  const {id} = route.params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState(null);
  const {role} = useSelector(state => state.auth);
  const imageModalRef = useRef(null);

  const fetchDetail = async () => {
    try {
      const res = await getUserExpenseDetail(id);
      const {data, success, errors} = res?.data || {};
      if (success) {
        setData(data);
      } else {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (err) {
      console.log('Fetch Expense Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const getFinalStatus = () => {
    if (data?.approved_at) return 'approved';
    if (data?.rejected_at) return 'rejected';
    return 'forwarded';
  };

  const openModal = type => {
    setActionType(type);
    setModalVisible(true);
    setRemark('');
  };

  const handleActionSubmit = async () => {
    const payload = {
      remarks: remark,
      expense_id: id,
    };
    try {
      const res =
        actionType === 'forward'
          ? await userExpenseForward(payload)
          : await userExpenseReject(payload);

      const {success, errors} = res?.data;
      if (success) {
        Alert.alert('Success', `Expense has been ${actionType}ed successfully`);
        setModalVisible(false);
        fetchDetail();
      } else {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (err) {
      console.log('Action Error:', err);
      Alert.alert('Error', 'An error occurred while processing your request');
    }
  };

  const renderForwardRow = (label, user) => {
    return (
      <ForwardRow
        label={label}
        name={user.name}
        empCode={user.emp_code}
        remarks={user.remarks}
        date={user.date}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={STATUS_COLORS.forwarded} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>No data found.</Text>
      </View>
    );
  }

  const finalStatus = getFinalStatus();
  const statusColor = STATUS_COLORS[finalStatus];
  const shouldRenderActionButtons = () => {
    let forwardedIndex =-1;
    for( const roleKey of ROLE_HIERARCHY) {
      if (data[roleKey]) {
          forwardedIndex = ROLE_HIERARCHY.indexOf(roleKey);
          break;
      }
    }
    const currentUserIndex = ROLE_HIERARCHY.findIndex(key => key === `forwarded_by_${role}_name`);
    if(forwardedIndex === -1 ) {
       return true;
    }
    if((currentUserIndex !== -1 && currentUserIndex >= forwardedIndex)){
      return false;
    }
    return true;
  };

  const checkRejectedByRole = () => {
    if (data.rejected_by_role) {
      return false;
    }
    return true;
  };

  const getTopForwardedRole = data => {
    const roleHierarchy = ['vp', 'rm', 'gm', 'zm', 'asm'];
    for (const role of roleHierarchy) {
      const forwardedAt = data[`forwarded_by_${role}_at`];
      if (forwardedAt && forwardedAt.trim() !== '') {
        return role;
      }
    }
    return -1;
  };
  const forwardedBy = getTopForwardedRole(data);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <InfoRow
            label="User"
            value={`${data.user_name} (${data.user_role?.toUpperCase()})`}
          />
          <InfoRow label="Date" value={data.date} />
          <InfoRow label="Type" value={data.expense_type?.replace('-', ' ')} />
          <InfoRow label="Amount" value={`₹${data.amount}`} />
          <InfoRow label="Extra" value={`₹${data.extra}`} />
          <InfoRow label="Details" value={data.details || '---'} />

          <Text style={[styles.status, {color: statusColor}]}>
            Status: {finalStatus.charAt(0).toUpperCase() + finalStatus.slice(1)}
          </Text>
          <TouchableOpacity
            onPress={() => imageModalRef.current?.showImage(true)}>
            <Image
              source={{uri: data.photo_path}}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {forwardedBy !== -1  && (
          <>
            <Text style={styles.sectionHeader}>Forwarded By</Text>
            {renderForwardRow(forwardedBy, {
              name: data[`forwarded_by_${forwardedBy}_name`],
              emp_code: data[`forwarded_by_${forwardedBy}_emp_code`],
              remarks: data[`forwarded_by_${forwardedBy}_remarks`],
              date: data[`forwarded_by_${forwardedBy}_at`],
            })}
          </>
        )}

        {finalStatus === 'approved' && (
          <StatusBox
            title="Approved By"
            color="#e9f8ef"
            data={{
              name: data.approved_by_name,
              emp_code: data.approved_by_emp_code,
              role: data.approved_by_role,
              remarks: data.approved_remarks || '---',
              date: data.approved_at,
            }}
          />
        )}

        {finalStatus === 'rejected' && (
          <StatusBox
            title="Rejected By"
            color="#fff"
            data={{
              name: data.rejected_by_name,
              emp_code: data.rejected_by_emp_code,
              role: data.rejected_by_role,
              remarks: data.rejected_remarks || '---',
              date: data.rejected_at,
            }}
          />
        )}
      </ScrollView>
      {shouldRenderActionButtons() && checkRejectedByRole()  && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => openModal('forward')}
            style={[styles.iconButton, {backgroundColor: COLORS.primary}]}>
            <Text style={styles.textButton}>Forward</Text>
            <Icon name="arrow-up-bold-box" color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openModal('reject')}
            style={[styles.iconButton, {backgroundColor: '#dc3545'}]}>
            <Text style={styles.textButton}>Reject</Text>
            <Icon name="close-box" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      )}

      <ExpenseImageModal item={data} ref={imageModalRef}></ExpenseImageModal>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {actionType === 'forward' ? 'Forward' : 'Reject'} Expense
            </Text>
            <TextInput
              value={remark}
              onChangeText={setRemark}
              placeholder="Enter remark"
              multiline
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, {backgroundColor: '#ccc'}]}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleActionSubmit}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor:
                      actionType === 'forward' ? COLORS.primary : '#dc3545',
                  },
                ]}>
                <Text style={{color: '#fff'}}>
                  {actionType === 'forward' ? 'Forward' : 'Reject'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const InfoRow = ({label, value}) => (
  <Text style={styles.label}>
    {label}: <Text style={styles.value}>{value}</Text>
  </Text>
);

const ForwardRow = ({label, name, empCode, remarks, date}) => (
  <View style={styles.forwardRow}>
    <Text style={styles.forwardLabel}>{label?.toString()?.toUpperCase()}</Text>
    <Text style={styles.forwardText}>Name: {name}</Text>
    <Text style={styles.forwardText}>Emp Code: {empCode}</Text>
    <Text style={styles.forwardText}>Remarks: {remarks}</Text>
    <Text style={styles.forwardText}>Date: {date}</Text>
  </View>
);

const StatusBox = ({title, color, data}) => (
  <View style={[styles.statusBox, {backgroundColor: color}]}>
    <Text style={styles.sectionHeader}>{title}</Text>
    <Text style={styles.forwardText}>Name: {data.name}</Text>
    <Text style={styles.forwardText}>Emp Code: {data.emp_code}</Text>
    <Text style={styles.forwardText}>Role: {data.role}</Text>
    <Text style={styles.forwardText}>Remarks: {data.remarks}</Text>
    <Text style={styles.forwardText}>Date: {data.date}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  forwardRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  forwardLabel: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    color: '#007bff',
  },
  forwardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  statusBox: {
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
    paddingVertical: 12,
  },
  textButton: {
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default UserExpenseDetailScreen;
