import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {List, Text} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';

const BeatInfoListItem = ({beat, onItemPressed}) => {
  return (
    <List.Item
      style={styles.container}
      id={beat._id}
      title={beat.name}
      description={beat.sap_code}
      right={() => (
        <Text variant="titleSmall" style={styles.frequency}>
          {beat.frequency?.toUpperCase()}
        </Text>
      )}
      onPress={() => onItemPressed()}
    />
  );
};

export default memo(BeatInfoListItem);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  frequency: {
    color: COLORS.accentPrimary,
    alignSelf: 'center',
  },
});
