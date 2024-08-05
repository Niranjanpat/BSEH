import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {COLORS} from '../../constants/theme/colors';

import {Picker} from '@react-native-picker/picker';
import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import VerticalSpacer from '../../components/VerticalSpacer';
import {getAllUsers, postStartJointWork} from '../../services/joint_service';
import {fetchJointWorkStatus} from '../../store/actions/auth';
import {Caption, Divider, Subheading, Text} from 'react-native-paper';
import theme from '../../constants/theme';

const JointWorkScreen = ({navigation}) => {
  const roles = [
    {
      label: 'SH',
      value: 'sh',
    },
    {
      label: 'SM',
      value: 'sm',
    },
    {
      label: 'RSM',
      value: 'rsm',
    },
    {
      label: 'DSM',
      value: 'dsm',
    },
    {
      label: 'KAM',
      value: 'kam',
    },
  ];

  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectType, setSelectType] = useState('kam');

  const {role} = useSelector(state => state.auth);

  const filteredRoles = useMemo(() => {
    return roles.splice(roles.findIndex(item => item.value === role) + 1);
  }, [role]);

  const dispatch = useDispatch();

  const fetchAllUsers = (page, role) => {
    setIsLoading(true);
    getAllUsers(page, role)
      .then(res => {
        setIsLoading(false);

        const {success, data} = res.data;

        if (success) {
          if (page === 1) {
            setUsers(data.users);
          } else {
            setUsers(users.concat(data.users));
          }
          setHasMore(data.has_more);
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.log('fetch all uses err', err?.response?.data);
      });
  };

  useEffect(() => {
    fetchAllUsers(1, 'kam');
  }, []);

  const onItemPress = item => {
    Alert.alert(
      'Confirm',
      `Proceed to start joint work with ${item.name} (Employee code: ${item.emp_code})`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Confirm',
          onPress: () => onSubmit(item._id),
        },
      ],
    );
  };

  const onSubmit = async id => {
    const granted =
      (await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Access Location Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )) === 'granted';

    if (!granted) return;

    Geolocation.getCurrentPosition(
      async position => {
        if (position) {
          const body = {
            guest_id: id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setIsLoading(true);
          postStartJointWork(body)
            .then(res => {
              const {success, errors} = res.data;
              if (success) {
                setIsLoading(false);
                navigation.goBack();
                dispatch(fetchJointWorkStatus());
              } else {
                setIsLoading(false);
                if (errors?.joint_working) {
                  return Alert.alert('Error', errors.joint_working);
                }

                Alert.alert('Error', JSON.stringify(errors));
              }
            })
            .catch(e => {
              setIsLoading(false);
              console.log(e);
            });
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <View
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      style={styles.container}>
      <Text>Role</Text>
      <View style={styles.picker}>
        <Picker
          style={{color: COLORS.onSurface}}
          dropdownIconColor={COLORS.onSurface}
          selectedValue={selectType}
          mode="dropdown"
          onValueChange={val => {
            setSelectType(val);
            setPage(1);
            fetchAllUsers(1, val);
          }}>
          {filteredRoles.map(e => (
            <Picker.Item label={e.label} value={e.value} key={e.value} />
          ))}
        </Picker>
      </View>
      <VerticalSpacer size={18} />
      <FlatList
        data={users}
        refreshing={isLoading}
        onRefresh={() => {
          setPage(1);
          fetchAllUsers(1, selectType);
        }}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <Pressable onPress={() => onItemPress(item)}>
            <Subheading>{item.name}</Subheading>
            <Caption>{item.emp_code}</Caption>
          </Pressable>
        )}
        ItemSeparatorComponent={
          <>
            <Divider />
            <VerticalSpacer size={10} />
          </>
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
            fetchAllUsers(page + 1, selectType);
          }
        }}
      />
    </View>
  );
};

export default JointWorkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  picker: {
    marginTop: 5,
    marginBottom: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
  list: {
    padding: 5,
  },
});
