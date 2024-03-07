import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Button, Dialog, RadioButton, Title} from 'react-native-paper';
import {getBeatList} from '../services/retailer_services';

const BeatModal = ({isMyVisits, visible, value, setValue, onDismiss}) => {
  const [beat, setBeat] = useState([]);
  useEffect(() => {
    getBeat();
  }, []);
  const getBeat = () => {
    getBeatList(isMyVisits)
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setBeat(data.routes);
        }
      })
      .catch(e => {
        alert(e);
      });
  };
  return (
    <Dialog
      visible={visible}
      style={styles.container}
      onDismiss={() => onDismiss(false)}>
      <Dialog.Title>Select Beat</Dialog.Title>
      <Dialog.Content style={[styles.container]}>
        <RadioButton.Group onValueChange={setValue} value={value}>
          <RadioButton.Item label="All Beat" value="" />
          <FlatList
            data={beat}
            keyExtractor={(item, _) => item._id}
            contentContainerStyle={{paddingBottom: 15}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            renderItem={({item}) => {
              return <RadioButton.Item label={item.name} value={item._id} />;
            }}
          />
        </RadioButton.Group>
      </Dialog.Content>
      <Dialog.Actions>
        <Button style={{margin: 10}} onPress={() => onDismiss(false)}>
          Done
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default BeatModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    marginVertical: 10,
  },
});
