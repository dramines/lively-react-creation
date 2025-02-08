import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SearchableItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.81:5002/api/foods');
      const data = await response.json();
      const formattedData = data.map((item) => ({
        id: item.id_food,
        name: item.name_food,
        description: item.description_food,
        type: item.type_food,
        imageUrl: `http://192.168.1.81:5002/api/${item.images[0]}`,
      }));
      setMenuItems(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItemGroup = (items, index) => {
    if (index % 3 === 0) {
      // Regular full-width card
      return (
        <TouchableOpacity
          key={items[0].id}
          style={styles.itemCardLarge}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: items[0].imageUrl }}
            style={styles.itemImage}
            PlaceholderContent={<ActivityIndicator color="#000" />}
          />
          <Text style={styles.itemName}>{items[0].name}</Text>
        </TouchableOpacity>
      );
    } else if (index % 3 === 1) {
      // Stacked cards
      return (
        <View key={`group-${index}`} style={styles.stackedContainer}>
          <TouchableOpacity
            style={styles.itemCardSmall}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: items[0].imageUrl }}
              style={styles.itemImage}
              PlaceholderContent={<ActivityIndicator color="#000" />}
            />
            <Text style={styles.itemName}>{items[0].name}</Text>
          </TouchableOpacity>
          {items[1] && (
            <TouchableOpacity
              style={styles.itemCardSmall}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: items[1].imageUrl }}
                style={styles.itemImage}
                PlaceholderContent={<ActivityIndicator color="#000" />}
              />
              <Text style={styles.itemName}>{items[1].name}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loaderText}>Loading menu items...</Text>
      </View>
    );
  }

  const groupedItems = [];
  for (let i = 0; i < menuItems.length; i += 2) {
    groupedItems.push(menuItems.slice(i, i + 2));
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {groupedItems.map((group, index) => renderItemGroup(group, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 8,
    gap: 16,
    flexDirection: 'row',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#000',
  },
  itemCardLarge: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  stackedContainer: {
    width: width * 0.6,
    height: width * 0.6,
    gap: 8,
  },
  itemCardSmall: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SearchableItems;
