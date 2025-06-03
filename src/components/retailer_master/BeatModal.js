import React, {memo} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Modal, Button, Portal, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constants/theme/colors';

const BeatModal = ({visible, value, setValue, onDismiss, beat = [], loading = false}) => {
  const handleSelect = id => {
    setValue(id);
    onDismiss(false);
  };

  const renderItem = ({item}) => {
    const isSelected = value === item._id;
    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.selected]}
        onPress={() => handleSelect(item._id)}>
        <View style={[styles.radioCircle, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Icon
          name="map-marker-radius"
          size={20}
          color={isSelected ? COLORS.primary : '#555'}
          style={styles.icon}
        />
        <Text style={styles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => onDismiss(false)} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Select Beat</Text>

        <TouchableOpacity
          style={[styles.optionContainer, value === '' && styles.selected]}
          onPress={() => handleSelect('')}>
          <View style={[styles.radioCircle, value === '' && styles.radioSelected]}>
            {value === '' && <View style={styles.radioDot} />}
          </View>
          <Icon name="select-all" size={20} color="#555" style={styles.icon} />
          <Text style={styles.optionText}>All Beat</Text>
        </TouchableOpacity>

        <View style={{maxHeight: 250}}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Loading beats...</Text>
            </View>
          ) : (
            <FlatList
              data={beat}
              keyExtractor={(item, index) => item._id || index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{paddingBottom: 25}}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.centered}>
                  <Icon name="close-box-outline" size={32} color="#999" />
                  <Text style={styles.emptyText}>No beats available</Text>
                </View>
              }
            />
          )}
        </View>

        <Button
          mode="contained"
          onPress={() => onDismiss(false)}>
          Done
        </Button>
      </Modal>
    </Portal>
  );
};

export default memo(BeatModal);

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  selected: {
    backgroundColor: '#f0f4ff',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  icon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
  
});
