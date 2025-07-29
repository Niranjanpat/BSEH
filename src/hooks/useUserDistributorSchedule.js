import {useState} from 'react';
import {
  approveUserDistributorSchedules,
  getUserDistributorSchedules,
  rejectUserDistributorSchedules,
} from '../services/user_distributor_schedule_service';
import dayjs from 'dayjs';
import {Alert} from 'react-native';

const useUserDistributorSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [userDistributorSchedules, setUserDistributorSchedules] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserDistributorSchedule = (page, start_date, end_date, status) => {
    setLoading(true);
    getUserDistributorSchedules(
      page,
      dayjs(start_date).format('YYYY-MM-DD'),
      dayjs(end_date).format('YYYY-MM-DD'),
      status,
    )
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setHasMore(data.has_more);
          if (page === 1) {
            setUserDistributorSchedules(data.distributor_schedules);
            console.log('user Distributor schedules', data.distributor_schedules);
          } else {
            setUserDistributorSchedules(
              userDistributorSchedules.concat(data.distributor_schedules),
            );
          }
        }
        else{
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch user distributor schedule err', err?.response?.data);
      });
  };

  const bulkApproveScheules = (ids, onSuccess) => {
    setActionLoading(true);

    approveUserDistributorSchedules({ids: JSON.stringify(ids)})
      .then(res => {
        setActionLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Selected schedules have been approved');

          onSuccess();
        } else {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setActionLoading(false);
        console.log('approve schedule err', err);
      });
  };

  const bulkRejectSchedules = (ids, onSuccess) => {
    setActionLoading(true);

    rejectUserDistributorSchedules({ids: JSON.stringify(ids)})
      .then(res => {
        setActionLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Selected schedules have been rejected');
          onSuccess();
        } else {
           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setActionLoading(false);
        console.log('approve schedule err', err?.response?.data);
      });
  };

  return {
    loading,
    hasMore,
    userDistributorSchedules,
    actionLoading,
    fetchUserDistributorSchedule,
    bulkApproveScheules,
    bulkRejectSchedules,
  };
};

export default useUserDistributorSchedule;
