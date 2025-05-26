// hooks/usePunchInModal.js
import {useState, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import {getWorkType, getVehicleType} from '../services/punch_service';
import {attendancePunchIn} from '../store/actions/auth';
import useLocationPermission from '../utils/useLocationPermission';

const usePunchInModal = (hideModal) => {
  const dispatch = useDispatch();
  const [startKm, setStartKm] = useState('');
  const [image, setImage] = useState(null);
  const [vehicleTypeSelected, setVehicleTypeSelected] = useState(null);
  const [workTypeSelected, setWorkTypeSelected] = useState(null);
  const [workType, setWorkType] = useState([]);
  const [vehicleType, setVehicleType] = useState([]);
  const [requestLocationPermission] = useLocationPermission();
  const longitude = useRef(null);
  const latitude = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    fetchWorkTypes();
    fetchVehicleTypes();
  }, []);

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

  const onSubmit = () => {
    Geolocation.getCurrentPosition(
      position => {
        latitude.current = position.coords.latitude;
        longitude.current = position.coords.longitude;

        const formData = new FormData();
        formData.append('punch_in_photo', {
          uri: image,
          type: 'image/jpeg',
          name: 'punchin.jpeg',
        });
        formData.append('longitude', longitude.current);
        formData.append('latitude', latitude.current);
        formData.append('work_type', workTypeSelected);
        formData.append('vehicle_type', vehicleTypeSelected);
        formData.append('start_km', startKm);

        if (!image || !startKm || !workTypeSelected || !vehicleTypeSelected) {
          Alert.alert('Error', 'Please fill all fields and select an image.');
          return;
        }

        dispatch(attendancePunchIn(formData));
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
    setStartKm('');
    setImage(null);
    setVehicleTypeSelected(null);
    setWorkTypeSelected(null);
  };

  return {
    startKm,
    setStartKm,
    image,
    setImage,
    vehicleTypeSelected,
    setVehicleTypeSelected,
    workTypeSelected,
    setWorkTypeSelected,
    workType,
    vehicleType,
    onSubmit,
  };
};

export default usePunchInModal;
