import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import ProductImageModal from '../ProductImageModal';
import {Divider, Text} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';

const AttendanceListItem = ({item}) => {
  const childRefPunchIn = useRef(null);
  const childRefPunchOut = useRef(null);

  return (
    <View style={{paddingBottom: 8}}>
      <View style={styles.listItemContainer}>
        <View style={styles.listItem}>
          <TouchableOpacity
            onPress={() => childRefPunchIn.current?.showImage(true)}>
            <Image
              source={{uri: item.punch_in_photo_path}}
              style={styles.listItemImage}
            />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text>{item.punch_in_time}</Text>
            <Text
              style={{flexWrap: 'wrap'}}
              numberOfLines={2}
              ellipsizeMode="tail">
              Reading: {item.start_vehicle_km}
            </Text>
          </View>
          <ProductImageModal
            item={{
              name: 'Punch-In Photo',
              photo_url: item.punch_in_photo_path,
            }}
            ref={childRefPunchIn}></ProductImageModal>
        </View>
        <View style={styles.listItem}>
          <TouchableOpacity
            onPress={() => childRefPunchOut.current?.showImage(true)}>
            <Image
              source={{uri: item.punch_out_photo_path}}
              style={styles.listItemImage}
            />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text>{item.punch_out_time}</Text>
            <Text
              style={{flexWrap: 'wrap'}}
              numberOfLines={2}
              ellipsizeMode="tail">
              Reading: {item.end_vehicle_km}
            </Text>
          </View>
          <ProductImageModal
            item={{
              name: 'Punch-Out Photo',
              photo_url: item.punch_out_photo_path,
            }}
            ref={childRefPunchOut}></ProductImageModal>
        </View>
      </View>
      <Text variant="labelMedium">
        Vehicle Type: {item.vehicle_type?.toUpperCase()}
      </Text>
      <Text variant="labelMedium">
        Total Distance: {item.total_vehicle_km} KMs
      </Text>
      <Divider
        style={{
          backgroundColor: COLORS.primary,
          height: 1,
          marginTop: 2,
        }}
      />
    </View>
  );
};

export default AttendanceListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flex: 1,
  },
  listItemImage: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginEnd: 8,
    resizeMode: 'cover',
  },
});
