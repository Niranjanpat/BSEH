import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  Menu,
  Subheading,
  Text,
} from 'react-native-paper';
import AllUsersList from '../../../components/daily_attendances/AllUsersList';
import UserAbsentModal from '../../../components/daily_attendances/UserAbsentModal';
import UsersList from '../../../components/daily_attendances/UsersList';
import {COLORS} from '../../../constants/theme/colors';
import useDailyAttendances from '../../../hooks/useDailyAttendances';
import {userRoles} from '../../../utils/user_roles';
import {useSelector} from 'react-redux';

const DailyAttendacesListScreen = ({navigation}) => {
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const {role} = useSelector(state => state.auth);
  const [roles, setRoles] = useState([]);

  const {
    filteredData,
    fetchUsersAttendances,
    hasMore,
    loading,
    selectedRole,
    setSelectedRole,
    setFilteredData,
    fetchAllUsersDailyAttendances,
    handleRoleChange,
  } = useDailyAttendances();

  useEffect(() => {
    fetchAllUsersDailyAttendances(date, page);
    role !== 'sc' && setUserRolesFilter(role);
  }, []);

  useEffect(() => {
    handleRoleChange(value, page);
  }, [selectedRole]);

  const setUserRolesFilter = role => {
    const roles = [];
    let isAdd = true;
    Object.keys(userRoles).map(key => {
      if (role === userRoles[key]) {
        isAdd = false;
        return;
      }
      if (isAdd) {
        roles.push(key);
      }
    });

    setRoles(roles);
  };

  const handleAllUsersClick = () => {
    if (value !== 0) {
      setFilteredData([]);
      setValue(0);
      setPage(1);
      fetchAllUsersDailyAttendances(date, 1);
    }
  };

  const handleUsersClick = () => {
    if (value !== 1) {
      setFilteredData([]);
      setValue(1);
      setPage(1);
      fetchUsersAttendances(date, 1);
    }
  };
  const handleUserAbsentClick = useCallback(id => {
    setId(id);
    setModalOpen(true);
  }, []);
  const handleAbsentSuccess = useCallback(() => {
    setModalOpen(false);
    fetchAllUsersDailyAttendances(date, page);
  }, []);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Daily attendances" />
        <Appbar.Action icon="calendar-outline" onPress={() => setOpen(true)} />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.section, value === 0 && styles.active]}
            activeOpacity={0.8}
            onPress={handleAllUsersClick}>
            <Text style={[styles.text, value === 0 && styles.activeText]}>
              All users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.section, value === 1 && styles.active]}
            activeOpacity={0.8}
            onPress={handleUsersClick}>
            <Text style={[styles.text, value === 1 && styles.activeText]}>
              Users
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Subheading style={{flex: 1}}>
            {dayjs(date).format('DD MMMM YYYY')}
          </Subheading>
          <View style={styles.row}>
            <Text
              style={{fontSize: 16, paddingHorizontal: 10, paddingVertical: 4}}>
              {selectedRole}
            </Text>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="filter"
                iconColor={COLORS.primary}
                size={20}
                onPress={openMenu}
              />
            }>
            {roles.map(key => (
              <Menu.Item
                key={key}
                onPress={() => {
                  closeMenu();
                  if (!loading) {
                    setSelectedRole(key);
                  }
                }}
                title={key}
              />
            ))}
          </Menu>
        </View>
        {value === 0 ? (
          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item?._id}
            renderItem={({item}) => (
              <AllUsersList
                item={item}
                onAbentClick={handleUserAbsentClick}
                date={date}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No data found!</Text>
            }
            onEndReached={() => {
              if (!loading && hasMore) {
                setPage(prev => prev + 1);
                fetchAllUsersDailyAttendances(date, page + 1);
              }
            }}
            ListFooterComponent={loading && <ActivityIndicator />}
          />
        ) : (
          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <UsersList item={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No data found!</Text>
            }
            onEndReached={() => {
              if (!loading && hasMore) {
                setPage(prev => prev + 1);
                fetchUsersAttendances(date, page + 1);
              }
            }}
            ListFooterComponent={loading && <ActivityIndicator />}
          />
        )}
        <DatePicker
          date={date}
          modal
          open={open}
          mode="date"
          onCancel={() => setOpen(false)}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setPage(1);
            if (value === 0) {
              fetchAllUsersDailyAttendances(date, 1);
            } else {
              fetchUsersAttendances(date, 1);
            }
          }}
        />
        <UserAbsentModal
          id={id}
          onClose={() => setModalOpen(false)}
          visible={modalOpen}
          date={date}
          onSuccess={() => handleAbsentSuccess()}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 3,
    backgroundColor: COLORS.background,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  active: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  activeText: {
    color: COLORS.light,
  },
  text: {
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
  },
  top: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default DailyAttendacesListScreen;
