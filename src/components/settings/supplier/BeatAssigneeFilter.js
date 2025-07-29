import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {Text} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';

const BeatAssigneeFilter = ({onAssigneeChange}) => {
  const {role} = useSelector(state => state.auth);

  const [assignee, setAssignee] = useState('');

  const handleChangeAssignee = (value) => {
    setAssignee(value);
    onAssigneeChange(value);
  }
  
  if (role !== 'so') {
      return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleChangeAssignee('')}
        style={assignee === '' ? styles.selected : styles.unselected}>
        <Text
          variant="bodyMedium"
          style={assignee === '' ? styles.selectedText : styles.unselectedText}>
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleChangeAssignee('me')}
        style={assignee === 'me' ? styles.selected : styles.unselected}>
        <Text
          variant="bodyMedium"
          style={
            assignee === 'me' ? styles.selectedText : styles.unselectedText
          }>
          Own
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleChangeAssignee('subordinate')}
        style={
          assignee === 'subordinate' ? styles.selected : styles.unselected
        }>
        <Text
          variant="bodyMedium"
          style={
            assignee === 'subordinate'
              ? styles.selectedText
              : styles.unselectedText
          }>
          Subordinate
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BeatAssigneeFilter;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  selected: {
    flex: 1,
    backgroundColor: COLORS.accentPrimary,
    padding: 10,
    borderRadius: 10,
  },
  unselected: {
    flex: 1,
    padding: 10,
  },
  selectedText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.light,
  },
  unselectedText: {
    textAlign: 'center',
    color: COLORS.lightGrey,
  },
});
