import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Icon library from Expo (or you can use any other)
import { useTranslation } from 'react-i18next';

const SearchBarComponent = ({ onSearch, onLocate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('MapScreen.Searchformeals')}
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#893571"
      />

      {/* Locate Me Button */}
      <TouchableOpacity style={styles.locateButton} onPress={onLocate}>
        <MaterialIcons name="my-location" size={24} color="#893571" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    marginBottom: 25,
  },
  searchBar: {
    flex: 1, // Allow searchbar to take available space
    width: '70%', // Ensure it only takes 70% width of the container
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    elevation: 0,
  },
  locateButton: {
    width: 40, // Fixed size
    height: 40,
    borderRadius: 20, // Makes the button circular
    backgroundColor: '#EFEFEF', // Matches with the search bar background
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Adds spacing between the search bar and the button
  },
});

export default SearchBarComponent;
