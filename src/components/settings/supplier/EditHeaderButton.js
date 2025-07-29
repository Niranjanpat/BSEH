import React from 'react';
import {IconButton} from 'react-native-paper';

const EditHeaderButton = ({onPress}) => {
  return <IconButton icon="square-edit-outline" onPress={onPress} />;
};

export default EditHeaderButton;
