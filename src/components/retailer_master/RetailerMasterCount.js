import {Alert, StyleSheet, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {getRetailerCount} from '../../services/retailer_services';
import { COLORS } from '../../constants/theme/colors';
import { useRoute } from '@react-navigation/native';

const RetailerMasterCount = ({assignee}) => {
  const [countData, setCountData] = useState(undefined);

  const route = useRoute();

  useEffect(() => {
    fetchRetailerCount();
  }, [route.params?.refreshCount]);

  const fetchRetailerCount = () => {
    getRetailerCount(assignee)
      .then(res => {
        
        const {data, success, errors} = res.data;

        if (success) {
          setCountData(data);
        } else if (errors) {
          
           Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  if (!countData) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={{color: 'green'}}>
        {countData?.active_customer_count}
      </Text>
      <Text variant="titleSmall">/</Text>
      <Text variant="labelSmall">
        {countData?.customer_count}
      </Text>
    </View>
  );
};

export default memo(RetailerMasterCount);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginHorizontal: 5,
  },
});
