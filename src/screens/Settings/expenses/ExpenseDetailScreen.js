import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {COLORS} from '../../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getExpenseDetail} from '../../../services/expense_sevice';
import {ROUTES} from '../../../constants/routes';
import {useFocusEffect} from '@react-navigation/native';
import RemoteImage from '../../../components/RemoteImage';
import ExpenseImageModal from '../../../components/ExpenseImageModal';

const STATUS_COLORS = {
  approved: 'green',
  rejected: 'red',
  pending: COLORS.primary,
};

const ExpenseDetailScreen = ({route, navigation}) => {
  const {expense, editable} = route.params;
  const [expenseDetail, setExpenseDetail] = useState({});
  const imageModalRef = useRef(null);

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

  const forwardedBy = getTopForwardedRole(expenseDetail);

  useLayoutEffect(() => {
    if (editable) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleEdit} style={{marginRight: 15}}>
            <Icon name="edit" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, expenseDetail]);

  const handleEdit = () => {
    navigation.navigate(ROUTES.expense_stack, {
      screen: ROUTES.update_complaint,
      params: {
        channel: 'update',
        expenseDetail,
        id: expense._id,
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchExpensesDetail();
    }, []),
  );

  const fetchExpensesDetail = async () => {
    try {
      const res = await getExpenseDetail(expense._id);
      const {data, success, errors} = res?.data;
      if (success) {
        setExpenseDetail(data);
        console.log('Expense Detail:', data);
      } else {
        console.log(errors);
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('getExpenses', error);
    }
  };

  const {
    amount,
    date,
    details,
    extra,
    expense_type,
    status,
    photo_path,
    approved_by_name,
    approved_by_emp_code,
    approved_by_role,
    approved_at,
    rejected_by_name,
    rejected_by_emp_code,
    rejected_by_role,
    rejected_at,
  } = expenseDetail;

  const finalStatus = approved_at
    ? 'approved'
    : rejected_at
    ? 'rejected'
    : 'pending';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <DetailRow icon="category" label="Expense Type" value={expense_type} />
          <DetailRow icon="calendar-today" label="Date" value={date} />
          <DetailRow icon="attach-money" label="Amount" value={`₹ ${amount}`} />
          <DetailRow icon="notes" label="Details" value={details || ''} />
          <DetailRow
            icon="info"
            label="Extra Expense"
            value={extra ? `₹ ${extra}` : ''}
          />
          <DetailRow
            icon="flag"
            label="Status"
            value={(status || 'pending').toUpperCase()}
            valueStyle={{color: STATUS_COLORS[finalStatus]}}
          />
          {finalStatus === 'approved' && approved_by_name && (
            <StatusBlock
              title="Approved"
              icon="verified-user"
              color="#e9f8ef"
              textColor="green"
              name={approved_by_name}
              empCode={approved_by_emp_code}
              role={approved_by_role}
              date={approved_at}
            />
          )}
          {finalStatus === 'rejected' && rejected_by_name && (
            <StatusBlock
              title="Rejected"
              icon="cancel"
              color="#fdecea"
              textColor="red"
              name={rejected_by_name}
              empCode={rejected_by_emp_code}
              role={rejected_by_role}
              date={rejected_at}
            />
          )}
          {photo_path ? (
            <>
              <TouchableOpacity
                onPress={() => imageModalRef.current?.showImage(true)}>
                <Text style={styles.photoLabel}>Photo</Text>
                <RemoteImage uri={photo_path} style={styles.image} />
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.value, {marginTop: 10}]}>
              No image uploaded
            </Text>
          )}
        </View>
        {forwardedBy !== -1 && (
          <>
            <Text style={styles.sectionHeader}>Forwarded By</Text>
            {renderForwardRow(forwardedBy, {
              name: expenseDetail[`forwarded_by_${forwardedBy}_name`],
              emp_code: expenseDetail[`forwarded_by_${forwardedBy}_emp_code`],
              remarks: expenseDetail[`forwarded_by_${forwardedBy}_remarks`],
              date: expenseDetail[`forwarded_by_${forwardedBy}_at`],
            })}
          </>
        )}
        <ExpenseImageModal item={expenseDetail} ref={imageModalRef} />
      </ScrollView>
    </SafeAreaView>
  );
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

const DetailRow = ({icon, label, value, valueStyle = {}}) => (
  <View style={styles.row}>
    <Icon name={icon} size={20} color={COLORS.primary} style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text
      style={[styles.value, valueStyle]}
      numberOfLines={1}
      ellipsizeMode="tail">
      {value}
    </Text>
  </View>
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

const StatusBlock = ({
  title,
  icon,
  color,
  textColor,
  name,
  empCode,
  role,
  date,
}) => (
  <View style={[styles.statusBlock, {backgroundColor: color}]}>
    <Text style={[styles.statusHeader, {color: textColor}]}>
      <Icon name={icon} size={18} /> {title} Details
    </Text>
    <Text style={styles.statusText}>Name: {name}</Text>
    <Text style={styles.statusText}>Emp Code: {empCode || '--'}</Text>
    <Text style={styles.statusText}>Role: {role || '--'}</Text>
    <Text style={styles.statusText}>Date: {date}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginRight: 4,
  },
  value: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  statusBlock: {
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
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
  statusHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default ExpenseDetailScreen;