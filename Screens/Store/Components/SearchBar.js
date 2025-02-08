import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('StoreScreen.search_placeholder')}
        onChangeText={onSearch}
        style={styles.searchBar}
        iconColor="#893571"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    elevation: 0,
  },
});

export default SearchBar;