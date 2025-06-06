// hooks/usePunchOutModal.js

import {useState, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import {getDailyAllowance} from '../services/punch_service';
import {
  attendancePunchOut,
  storeAttendanceLoading,
} from '../store/actions/auth';
import useLocationPermission from '../utils/useLocationPermission';

const usePunchOutModal = () => {
  const dispatch = useDispatch();
  const [requestLocationPermission] = useLocationPermission();

  const [workFeedback, setWorkFeedback] = useState('');
  const [dayEndDetail, setDayEndDetail] = useState('');
  const [vehicleReading, setVehicleReading] = useState('');
  const [dailyAllowanceSelected, setDailyAllowanceSelected] = useState(null);
  const [dailyAllowance, setDailyAllowance] = useState([]);
  const [image, setImage] = useState(null);

  const longitude = useRef(null);
  const latitude = useRef(null);
  const totalVehicleReading = useRef('');
  var timer = null;

  useEffect(() => {
    requestLocationPermission();
    fetchDailyAllowances();
  }, []);

  const onVehicleReadingChange = (value, startKm) => {
    const endKms = parseFloat(value);
    const startKms = parseFloat(startKm);
    if (endKms > startKms) {
      totalVehicleReading.current = endKms - startKms;
    } else {
      totalVehicleReading.current = '';
    }
    setVehicleReading(value);
  };

  const fetchDailyAllowances = async () => {
    try {
      const res = await getDailyAllowance();
      const {data, success, errors} = res?.data;
      if (success) {
        setDailyAllowance(data.daily_allowances);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (e) {
      console.log('fetchDailyAllowances', e);
    }
  };

  const onSubmit = isRemarkField => {
    if (isRemarkField) {
      if (!workFeedback || !dayEndDetail || !dailyAllowanceSelected) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }
    } else {
      if (
        !workFeedback ||
        !dayEndDetail ||
        vehicleReading === '' ||
        !dailyAllowanceSelected ||
        !image
      ) {
        Alert.alert('Error', 'Please fill all fields and select an image.');
        return;
      }
      if (totalVehicleReading.current === '') {
        Alert.alert('Error', 'End KMs should be greater than start KMs.');
        return;
      }
    }

    dispatch(storeAttendanceLoading(true));
    Geolocation.getCurrentPosition(
      position => {
        latitude.current = position.coords.latitude;
        longitude.current = position.coords.longitude;

        const formData = new FormData();
        formData.append('work_feedback', workFeedback);
        formData.append('day_end_details', dayEndDetail);
        formData.append('end_vehicle_km', vehicleReading);
        formData.append('daily_allowance', dailyAllowanceSelected);
        formData.append('latitude', latitude.current);
        formData.append('longitude', longitude.current);
        if(!isRemarkField){
           formData.append('total_vehicle_km', totalVehicleReading.current);
        formData.append('punch_out_photo', {
          uri: image,
          type: 'image/jpeg',
          name: 'punchout.jpeg',
        });
        }
       

        dispatch(attendancePunchOut(formData));
        resetForm();
      },
      error => {
        console.error('Geolocation error:', error);
        dispatch(storeAttendanceLoading(false));
        Alert.alert('Location', 'Check your location service is enabled.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const resetForm = () => {
    setWorkFeedback('');
    setDayEndDetail('');
    setVehicleReading('');
    totalVehicleReading.current = '';
    setDailyAllowanceSelected(null);
    setImage(null);
  };

  return {
    workFeedback,
    setWorkFeedback,
    dayEndDetail,
    setDayEndDetail,
    vehicleReading,
    onVehicleReadingChange,
    totalVehicleReading,
    dailyAllowance,
    dailyAllowanceSelected,
    setDailyAllowanceSelected,
    image,
    setImage,
    onSubmit,
  };
};

export default usePunchOutModal;
