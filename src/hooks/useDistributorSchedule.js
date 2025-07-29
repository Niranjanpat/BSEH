import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {useState} from 'react';
import {Alert} from 'react-native';
import {
  addDistributorSchedule,
  cancelDistributorSchedule,
  deleteDistributorSchedule,
  getDistributorScehduleDetails,
  getDistributorSchedules,
  updateDistributorSchedule,
} from '../services/distributor_schedule_service';

const useDistributorSchedule = () => {
  const [distributorSchedules, setDistributorScheules] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [scheduleDetail, setScehduleDetail] = useState({});

  const {goBack, pop} = useNavigation();

  const fetchDistributorSchedules = (page, start_date, end_date) => {
    setLoading(true);
    getDistributorSchedules(
      page,
      dayjs(start_date).format('YYYY-MM-DD'),
      dayjs(end_date).format('YYYY-MM-DD'),
    )
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setHasMore(data.has_more);

          if (page === 1) {
            setDistributorScheules(data.distributor_schedules);
          } else {
            setDistributorScheules(distributorSchedules.concat(data.distributor_schedules));
          }
        }
        else{
             Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log('fetch distributor schedules err', err?.response?.data);
      });
  };


  const postDistributorSchedule = data => {
    setLoading(true);
    addDistributorSchedule(data)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;
        if (success) {
          Alert.alert('Success', 'Distributor schedule has been added');
          goBack();
        } else {
          const {route_id} = errors;

           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('add distributor schedule err', err?.response?.data);
      });
  };

  const fetchDistributorScheduleDetails = id => {
    setLoading(true);
    getDistributorScehduleDetails(id)
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setScehduleDetail(data);
        } else {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  const editDistributorSchedule = (data, id) => {
    setLoading(true);
    updateDistributorSchedule(data, id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Distributor schedule has been updated');
          pop(2);
        } else {
          const {route_id} = errors;

          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('edit Distirbutor schedule err', err?.response?.data);
      });
  };

  const removeDistributorSchedule = id => {
    setLoading(true);
    deleteDistributorSchedule(id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Distributor schedule has been deleted');
          goBack();
        } else {
           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  const handleDistributorCancel = (data, id) => {
    setLoading(true);
    cancelDistributorSchedule(data, id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Distributor schedule has been cancelled');
          goBack();
        } else {
          const {reason} = errors;

          if (reason) {
            Alert.alert('Error', reason);
            return;
          }

           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  return {
    hasMore,
    distributorSchedules,
    loading,
    scheduleDetail,
    fetchDistributorSchedules,
    postDistributorSchedule,
    fetchDistributorScheduleDetails,
    editDistributorSchedule,
    removeDistributorSchedule,
    handleDistributorCancel,
  };
};

export default useDistributorSchedule;
