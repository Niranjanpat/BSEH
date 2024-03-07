import React, {useEffect, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Title, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {COLORS} from '../constants/theme/colors';
import {
  getCurrentOverAllTargetsAmount,
  getTotalAchievements,
} from '../store/actions/performance';
import HorizontalSpacer from './HorizontalSpacer';

const Achievement = () => {
  const dispatch = useDispatch();
  const {totalAchievements, overallAmountTarget} = useSelector(
    state => state.performance,
  );

  useEffect(() => {
    dispatch(getTotalAchievements());
    dispatch(getCurrentOverAllTargetsAmount());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.boxView}>
          <Icon name="star" size={40} color={COLORS.primary} />
          <Text>Target</Text>
          <Title>
            {overallAmountTarget
              ? overallAmountTarget.value
                ? overallAmountTarget.value
                : 'XXX'
              : null}
          </Title>
        </View>
        <HorizontalSpacer />
        <View style={styles.boxView}>
          <Icon name="award" color={COLORS.primary} size={40} />
          <Text>Achievement</Text>
          <Title>{totalAchievements?.toFixed(2)}</Title>
        </View>
      </View>
      {/* <Text style={styles.disclaimer}>Target/Achievement as of {today}*</Text> */}
    </View>
  );
};

export default memo(Achievement);

const styles = StyleSheet.create({
  container: {
    padding: 10,

    backgroundColor: '#f6f6f6',
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },

  boxView: {
    width: '50%',
    border: 1,
    alignItems: 'center',
    padding: 10,
    elevation: 1,
    backgroundColor: '#f6f6f6',
  },

  disclaimer: {
    fontSize: 12,
    alignSelf: 'flex-end',
    color: COLORS.accentSecondary,
  },
});
