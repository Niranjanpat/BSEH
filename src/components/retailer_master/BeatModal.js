import React from 'react';
import {memo} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Button, Dialog, Portal, RadioButton, Text} from 'react-native-paper';

const BeatModal = ({visible, value, setValue, onDismiss, beat}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        style={[styles.container, {height: '60%'}]}
        onDismiss={() => onDismiss(false)}>
        <Dialog.Title>Select Beat</Dialog.Title>
        <Dialog.Content style={[styles.container, {height: '65%'}]}>
          <RadioButton.Group onValueChange={setValue} value={value}>
            <RadioButton.Item label="All Beat" value="" />
            <FlatList
              data={beat}
              keyExtractor={(item, _) => item._id}
              contentContainerStyle={{paddingBottom: 25,}}
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
    </Portal>
  );
};

export default memo(BeatModal);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    overflow: 'hidden',
    marginVertical: 10,
  },
});
