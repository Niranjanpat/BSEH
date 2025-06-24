import {useState} from 'react';
import {
  getAllUsersDailyAttendance,
  getUsersDailyAttendance,
  markUserAbsent,
} from '../services/daily_attendance_service';
import dayjs from 'dayjs';
import {Alert} from 'react-native';
import {userRoles} from '../utils/user_roles';
import Geolocation from 'react-native-geolocation-service';

const useDailyAttendances = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(Object.keys(userRoles)[0]);

  const fetchUsersAttendances = (date, page) => {
    setLoading(true);
    getUsersDailyAttendance(dayjs(date).format('YYYY-MM-DD'), page)
      .then(res => {
        setLoading(false);
        const {success, data} = res?.data;

        if (success) {
          console.log('data', data);
          if (page === 1) {
            setData(data?.daily_attendances);
          } else {
            setData(data.concat(data?.daily_attendances));
          }
          setHasMore(data?.has_more);
          filterDailyAttendances(page, 1, data?.daily_attendances);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch users attendance err', err);
      });
  };
  const fetchAllUsersDailyAttendances = (date, page) => {
    setLoading(true);
    getAllUsersDailyAttendance(dayjs(date).format('YYYY-MM-DD'), page)
      .then(res => {
        setLoading(false);
        const {success, data, errors} = res?.data;

        if (success) {
          if (page === 1) {
            setData(data?.users);
          } else {
            setData(data.concat(data?.users));
          }
          setHasMore(data?.has_more);
          filterDailyAttendances(page, 0, data?.users);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch users attendance err', err);
      });
  };

  const filterDailyAttendances = (page, tab, attendanceData) => {
    console.log('attendanceData', attendanceData);
    console.log('attendanceData', selectedRole);

    if (userRoles[selectedRole] === userRoles.ALL) {
      if (page === 1) {
        setFilteredData(attendanceData);
      } else {
        setFilteredData(filteredData.concat(attendanceData));
      }
      return;
    }

    const filteredData = (attendanceData || []).filter(attendance => {
      if (tab === 0) {
        return checkRoleAll(attendance);
      }
      return checkRoleUser(attendance);
    });

    if (page === 1) {
      setFilteredData(filteredData);
    } else {
      setFilteredData(filteredData.concat(filteredData));
    }
  };

  const checkRoleAll = ({role}) => {
    console.log('role', role, selectedRole);

    if (role === userRoles[selectedRole]) {
      return true;
    }

    return false;
  };

  const checkRoleUser = ({user_role}) => {
    console.log('user_role', user_role);

    if (user_role === userRoles[selectedRole]) {
      return true;
    }

    return false;
  };

  const handleRoleChange = (tab, page) => {
    filterDailyAttendances(page, tab, data);
  };

  const postUserAbsent = (
    date,
    user_id,
    reason,
    leave_reason,
    handleClose,
    handleSuccess,
  ) => {
    setActionLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        markUserAbsent({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          date: dayjs(date).format('YYYY-MM-DD'),
          user_id,
          reason,
          leave_reason,
        })
          .then(res => {
            setActionLoading(false);
            const {success} = res?.data;
            if (success) {
              Alert.alert(
                'Success',
                `User marked absent for ${dayjs(date).format('DD MMMM YYYY')}`,
              );
              handleSuccess();
            } else {
              const {date, user_id, reason, leave_reason} = res?.data?.errors;
              if (date) {
                Alert.alert('Error', date);
                return;
              }
              if (user_id) {
                Alert.alert('Error', user_id);
                return;
              }
              if (reason) {
                Alert.alert('Error', reason);
                return;
              }
              if (leave_reason) {
                Alert.alert('Error', leave_reason);
                return;
              }
              handleClose();
            }
          })
          .catch(err => {
            setActionLoading(false);
            handleClose();
            console.log(
              'mark users attendance absent err',
              err?.response?.data,
            );
          });
      },
      err => {
        setActionLoading(false);
        Alert.alert('Location', 'Check if your location service is enabled.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return {
    filteredData,
    hasMore,
    loading,
    actionLoading,
    selectedRole,
    setSelectedRole,
    setFilteredData,
    fetchUsersAttendances,
    fetchAllUsersDailyAttendances,
    postUserAbsent,
    handleRoleChange,
  };
};

export default useDailyAttendances;
