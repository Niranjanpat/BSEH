// hooks/usePunchOutModal.js

import {useState, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import {getDailyAllowance} from '../services/punch_service';
import {attendancePunchOut} from '../store/actions/auth';
import useLocationPermission from '../utils/useLocationPermission';

const usePunchOutModal = (hideModal) => {
  const dispatch = useDispatch();
  const [requestLocationPermission] = useLocationPermission();

  const [workFeedback, setWorkFeedback] = useState('');
  const [dayEndDetail, setDayEndDetail] = useState('');
  const [vehicleReading, setVehicleReading] = useState('');
  const [totalVehicleReading, setTotalVehicleReading] = useState('');
  const [dailyAllowanceSelected, setDailyAllowanceSelected] = useState(null);
  const [dailyAllowance, setDailyAllowance] = useState([]);
  const [image, setImage] = useState(null);

  const longitude = useRef(null);
  const latitude = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    fetchDailyAllowances();
  }, []);

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

  const onSubmit = () => {
    Geolocation.getCurrentPosition(
      position => {
        latitude.current = position.coords.latitude;
        longitude.current = position.coords.longitude;

        const formData = new FormData();
        formData.append('work_feedback', workFeedback);
        formData.append('day_end_details', dayEndDetail);
        formData.append('end_vehicle_km', vehicleReading);
        formData.append('total_vehicle_km', totalVehicleReading);
        formData.append('daily_allowance', dailyAllowanceSelected);
        formData.append('latitude', latitude.current);
        formData.append('longitude', longitude.current);
        formData.append('punch_out_photo', {
          uri: image,
          type: 'image/jpeg',
          name: 'punchout.jpeg',
        });

        if (!workFeedback || !dayEndDetail || !vehicleReading || !totalVehicleReading || !dailyAllowanceSelected || !image) {
          Alert.alert('Error', 'Please fill all fields and select an image.');
          return;
        }

        dispatch(attendancePunchOut(formData));
        hideModal();
        resetForm();
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const resetForm = () => {
    setWorkFeedback('');
    setDayEndDetail('');
    setVehicleReading('');
    setTotalVehicleReading('');
    setDailyAllowanceSelected(null);
    setImage(null);
  };

  return {
    workFeedback,
    setWorkFeedback,
    dayEndDetail,
    setDayEndDetail,
    vehicleReading,
    setVehicleReading,
    totalVehicleReading,
    setTotalVehicleReading,
    dailyAllowance,
    dailyAllowanceSelected,
    setDailyAllowanceSelected,
    image,
    setImage,
    onSubmit,
  };
};

export default usePunchOutModal;
