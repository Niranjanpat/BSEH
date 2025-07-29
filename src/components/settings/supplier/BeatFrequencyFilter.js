import {View} from 'react-native';
import React, {useState} from 'react';
import {IconButton, Menu, Text} from 'react-native-paper';

const BeatFrequencyFilter = ({onFilterChange}) => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('');

  const filterList = [
    {label: 'All', value: ''},
    {label: 'Daily', value: 'daily'},
    {label: 'By Weekly', value: 'by-weekly'},
    {label: 'Weekly', value: 'weekly'},
    {label: 'Fortnightly', value: 'fortnightly'},
    {label: 'Monthly', value: 'monthly'},
  ];

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleFilterChange = item => {
    setFilter(item.value);
    closeMenu();
    onFilterChange(item.value);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={
        <IconButton icon={'filter-outline'} size={22} onPress={openMenu} />
      }>
      {filterList.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleFilterChange(item)}
          title={item.label}
          trailingIcon={filter === item.value && 'check'}
        />
      ))}
    </Menu>
  );
};

export default BeatFrequencyFilter;
