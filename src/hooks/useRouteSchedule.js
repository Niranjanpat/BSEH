import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {useState} from 'react';
import {Alert} from 'react-native';
import {
  addRouteSchedule,
  cancelRouteSchedule,
  deleteRouteSchedule,
  getRouteScehduleDetails,
  getRouteSchedules,
  getRoutes,
  updateRouteSchedule,
} from '../services/route_service';

const useRouteSchedule = () => {
  const [routeSchedules, setRouteScheules] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [scheduleDetail, setScehduleDetail] = useState({});

  const {goBack, pop} = useNavigation();

  const fetchRouteSchedules = (page, start_date, end_date) => {
    setLoading(true);
    getRouteSchedules(
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
            setRouteScheules(data.route_schedules);
          } else {
            setRouteScheules(routeSchedules.concat(data.route_schedules));
          }
        }
      })
      .catch(err => {
        setLoading(false);

        console.log('fetch route schedules err', err?.response?.data);
      });
  };

  const fetchRoutes = () => {
    getRoutes()
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          setRoutes(data.routes);
        } else if (errors) {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        console.log('fetch routes err', err?.response?.data);
      });
  };

  const postRouteSchedule = data => {
    setLoading(true);
    addRouteSchedule(data)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Route schedule has been added');
          goBack();
        } else {
          if (errors) {
            Alert.alert(null, Object.values(errors).join(', '));
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('add route schedule err', err?.response?.data);
      });
  };

  const fetchRouteScheduleDetails = id => {
    setLoading(true);
    getRouteScehduleDetails(id)
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setScehduleDetail(data);
        } else if (errors) {
           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  const editRouteSchedule = (data, id) => {
    setLoading(true);
    updateRouteSchedule(data, id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Route schedule has been updated');
          pop(2);
        } else if (errors) {
          const {route_id} = errors;

          if (route_id) {
            Alert.alert('Error', 'Beat has to be selected');
            return;
          }

          Alert.alert(null, Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('edit route schedule err', err?.response?.data);
      });
  };

  const removeRouteSchedule = id => {
    setLoading(true);
    deleteRouteSchedule(id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Route schedule has been deleted');
          goBack();
        } else if (errors) {
           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  const handleRouteCancel = (data, id) => {
    setLoading(true);
    cancelRouteSchedule(data, id)
      .then(res => {
        setLoading(false);

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Route schedule has been cancelled');
          goBack();
        } else if (errors) {
          const {reason} = errors;

          if (reason) {
            Alert.alert('Error', reason);
            return;
          }

          Alert.alert(null, Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err?.response?.data);
      });
  };

  return {
    hasMore,
    routeSchedules,
    loading,
    routes,
    scheduleDetail,
    fetchRouteSchedules,
    fetchRoutes,
    postRouteSchedule,
    fetchRouteScheduleDetails,
    editRouteSchedule,
    removeRouteSchedule,
    handleRouteCancel,
  };
};

export default useRouteSchedule;
