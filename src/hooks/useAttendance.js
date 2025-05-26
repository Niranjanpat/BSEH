import {useRef, useState} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getAbsentReason, getPresentReason, saveMarkPresent, saveMarkAbsent} from '../services/punch_service'; // Adjust paths
import {ROUTES} from '../constants/routes'; // Adjust path
import {useNavigation} from '@react-navigation/native';
import {getDataFromMmkv, setDataInMmkv} from '../store/MMKVStore'; // Adjust path

export const useAttendance = () => {
  const navigation = useNavigation();
  const latitude = useRef(null);
  const longitude = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading]= useState(false);

  const getAbsentReasons = () => {
    setLoading(true);
    getAbsentReason()
      .then(res => {
        const {data, errors, success} = res?.data;
        if (success) {
          setData(data.reasons);
        } else {
          Alert.alert('Error', JSON.stringify(errors));
        }
      })
      .catch(e => {
        console.log('getAbsentReasons', e);
      })
      .finally(() => {
        setLoading(false);
      }
    );  
  };

  const getPresentReasons = () => {
    setLoading(true);
    getPresentReason()
      .then(res => {
        const {data, errors, success} = res?.data;
        if (success) {
          setData(data.reasons);
        } else {
          Alert.alert('Error', JSON.stringify(errors));
        }
      })
      .catch(e => {
        console.log('getPresentReasons', e);
      }).finally(() => {
        setLoading(false);
      }
    );
  };

  const markPresent = (attendanceData, hideModal, channel,setSelection) => {
    setLoading(true);
    saveMarkPresent(attendanceData)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setDataInMmkv('Attendance', channel);
          setSelection(channel);
          navigation.navigate(ROUTES.attendance);
          hideModal();
        } else {
          Alert.alert('Error!', Object.values(errors || {}).join(', '));
        }
      })
      .catch(e => {
        console.log('markPresent', e);
      }).finally(() => {
        setLoading(false);
      }
    );
  };

  const markAbsent = (attendanceData, hideModal,channel,setSelection,selectedOption) => {
    setLoading(true);
    saveMarkAbsent(attendanceData)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setDataInMmkv('Attendance', channel);
          setDataInMmkv('AbsentReason', selectedOption);
          setSelection(channel);
          navigation.navigate(ROUTES.attendance);
          hideModal();
        } else {
          Alert.alert('Error!', Object.values(errors || {}).join(', '));
        }
      })
      .catch(e => {
        console.log('markAbsent', e);
      }).finally(() => {
        setLoading(false);
      }
    );
  };

  const onSubmit = (hideModal,channel,setSelection,selectedOption) => {
    Geolocation.getCurrentPosition(
      position => {
        latitude.current = position.coords.latitude;
        longitude.current = position.coords.longitude;

        if (!selectedOption) {
          Alert.alert('Please select an option');
          return;
        }

        const attendanceData = {
          longitude: longitude.current,
          latitude: latitude.current,
          reason: selectedOption,
        };

        if (channel === 'Present') {
          markPresent(attendanceData, hideModal,channel,setSelection);
        } else {
          markAbsent(attendanceData, hideModal, channel,setSelection,selectedOption);
        }
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return {
    data,
    loading,
    getAbsentReasons,
    getPresentReasons,
    onSubmit,
  };
};





//   const getAbsentReasons = () => {
//     getAbsentReason()
//       .then(res => {
//         const {data, errors, success} = res?.data;
//         if (success) {
//           setData(data.reasons);
//         } else {
//           Alert.alert('Error', JSON.stringify(errors));
//         }
//       })
//       .catch(e => {
//         console.log('getAbsentReasons', e);
//       });
//   };

//   const getPresentReasons = () => {
//     getPresentReason()
//       .then(res => {
//         const {data, errors, success} = res?.data;
//         if (success) {
//           setData(data.reasons);
//         } else {
//           Alert.alert('Error', JSON.stringify(errors));
//         }
//       })
//       .catch(e => {
//         console.log('getPresentReasons', e);
//       });
//   };



//   const markPresent = data => {
//     saveMarkPresent(data)
//       .then(res => {
//         const {data, errors, success} = res.data;
//         if (success) {
//           setData('Attendance', channel);
//           setSelection(channel);
//           navigation.navigate(ROUTES.attendance);
//           hideModal();
//         } else {
//           if (errors) {
//             Alert.alert('Error!', Object.values(errors).join(', '));
//           }
//         }
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   const markAbsent = data => {
//     saveMarkAbsent(data)
//       .then(res => {
//         const {data, errors, success} = res.data;
//         console.log(res.data);
//         if (success) {
//           setData('Attendance', channel);
//           setData('AbsentReason', selectedOption);
//           setSelection(channel);
//           navigation.navigate(ROUTES.attendance);
//           hideModal();
//         } else {
//           if (errors) {
//             Alert.alert('Error!', Object.values(errors).join(', '));
//           }
//         }
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };



//     const onSubmit = () => {
//       Geolocation.getCurrentPosition(
//         position => {
//           latitude.current = position.coords.latitude;
//           longitude.current = position.coords.longitude;
//           if (selectedOption) {
//             const data = {
//               longitude: longitude.current,
//               latitude: latitude.current,
//               reason: selectedOption,
//             };
//             if (channel == 'Present') {
//               markPresent(data);
//             } else {
//               markAbsent(data);
//             }
//           } else {
//             Alert.alert('Please select an option');
//             return;
//           }
//         },
//         error => {
//           console.error('Geolocation error:', error);
//         },
//         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//       );
  
//       if (longitude.current && latitude.current && selectedOption) {
//         console.log(longitude.current, latitude.current, selectedOption);
//       }
//     };