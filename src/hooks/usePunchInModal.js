// hooks/usePunchInModal.js
import {useState, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import {getWorkType, getVehicleType} from '../services/punch_service';
import {attendancePunchIn, storeAttendanceLoading} from '../store/actions/auth';
import useLocationPermission from '../utils/useLocationPermission';

const usePunchInModal = () => {
  const dispatch = useDispatch();
  const [workType, setWorkType] = useState([]);
  const [vehicleType, setVehicleType] = useState([]);
  const [isRemarkField, setIsRemarkField] = useState(false);
  const [requestLocationPermission] = useLocationPermission();
  const longitude = useRef(null);
  const latitude = useRef(null);
  const vehicleTypeSelected = useRef(null);
  const workTypeSelected = useRef(null);
  const image = useRef(null);
  const remark = useRef('');
  const startKm = useRef('');

  useEffect(() => {
    requestLocationPermission();
    fetchWorkTypes();
    fetchVehicleTypes();
  }, []);

  const onWorkTypeSelected = type => {
    workTypeSelected.current = type;
  };

  const onVehicleTypeSelected = type => {
    setIsRemarkField(
      type === 'public-transport' || type === 'others-enter-tada-remarks',
    );
    vehicleTypeSelected.current = type;
  };

  const onImageSelected = img => {
    image.current = img;
  };

  const onRemarkChanged = value => {
    remark.current = value;
  };
  const onKmChanged = km => {
    startKm.current = km;
  };

  const fetchWorkTypes = async () => {
    try {
      const res = await getWorkType();
      const {data, success, errors} = res?.data;
      if (success) {
        setWorkType(data.work_types);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getWorkTypes', error);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const res = await getVehicleType();
      const {data, success, errors} = res?.data;
      if (success) {
        setVehicleType(data.vehicle_types);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getVehicleTypes', error);
    }
  };

  const onSubmit = async isRemark => {
  try {
    // Validate input
    if (isRemark) {
      if (
        !remark.current?.trim() ||
        !workTypeSelected.current ||
        !vehicleTypeSelected.current
      ) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
    } else {
      if (
        !image.current ||
        !startKm.current?.trim() ||
        !workTypeSelected.current ||
        !vehicleTypeSelected.current
      ) {
        Alert.alert('Error', 'Please fill all fields and select an image.');
        return;
      }
    }

    dispatch(storeAttendanceLoading(true));

    // Ensure location permissions are handled outside this function in app setup

    Geolocation.getCurrentPosition(
      async position => {
        try {
          latitude.current = position.coords.latitude;
          longitude.current = position.coords.longitude;

          const formData = new FormData();

          if (image.current && startKm.current) {
            formData.append('punch_in_photo', {
              uri: image.current,
              type: 'image/jpeg',
              name: 'punchin.jpeg',
            });
          }

          formData.append('longitude', String(longitude.current || ''));
          formData.append('latitude', String(latitude.current || ''));
          formData.append('work_type', String(workTypeSelected.current || ''));
          formData.append('vehicle_type', String(vehicleTypeSelected.current || ''));

          if (isRemark) {
            formData.append('remarks', String(remark.current || ''));
          } else {
            formData.append('start_vehicle_km', String(startKm.current || ''));
          }

          await dispatch(attendancePunchIn(formData));
          resetForm();
        } catch (err) {
          console.error('Form submission error:', err);
          Alert.alert('Error', 'Something went wrong while submitting the form.');
        } finally {
          dispatch(storeAttendanceLoading(false));
        }
      },
      error => {
        console.error('Geolocation error:', error);
        dispatch(storeAttendanceLoading(false));
        Alert.alert('Location', 'Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  } catch (err) {
    console.error('Unhandled error:', err);
    dispatch(storeAttendanceLoading(false));
    Alert.alert('Unexpected Error', 'Something went wrong. Please try again.');
  }
};


  const resetForm = () => {
    startKm.current = '';
    remark.current = '';
    image.current = null;
    vehicleTypeSelected.current = null;
    workTypeSelected.current = null;
  };

  return {
    onKmChanged,
    onImageSelected,
    onVehicleTypeSelected,
    onWorkTypeSelected,
    workType,
    vehicleType,
    onSubmit,
    onRemarkChanged,
    isRemarkField,
  };
};

export default usePunchInModal;
