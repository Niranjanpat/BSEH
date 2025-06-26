import {useState} from 'react';
import {
  approveUserRouteSchedules,
  getUserRouteSchedules,
  rejectUserRouteSchedules,
} from '../services/route_service';
import dayjs from 'dayjs';
import {Alert} from 'react-native';

const useUserRouteSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [userRouteSchedules, setUserRouteSchedules] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserRouteSchedule = (page, start_date, end_date, status) => {
    setLoading(true);

    getUserRouteSchedules(
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
            setUserRouteSchedules(data.route_schedules);
            console.log('user route schedules', data.route_schedules);
          } else {
            setUserRouteSchedules(
              userRouteSchedules.concat(data.route_schedules),
            );
          }
        }
        else{
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch user route schedule err', err?.response?.data);
      });
  };

  const bulkApproveScheules = (ids, onSuccess) => {
    setActionLoading(true);

    approveUserRouteSchedules({ids: JSON.stringify(ids)})
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

    rejectUserRouteSchedules({ids: JSON.stringify(ids)})
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
    userRouteSchedules,
    actionLoading,
    fetchUserRouteSchedule,
    bulkApproveScheules,
    bulkRejectSchedules,
  };
};

export default useUserRouteSchedule;
