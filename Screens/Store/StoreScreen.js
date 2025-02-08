import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import Header from '../Commons/Header';
import FooterNavigator from '../FooterNavigator/FooterNavigator';
import Categories from './Components/Categories';
import StoreList from './Components/StoreList';
import SearchBar from './Components/SearchBar';

const mockStores = [
  {
    id: '1',
    name: 'Handmade Jewelry',
    description: 'Beautiful handcrafted jewelry made with love. Each piece is unique and tells its own story. Perfect for gifts or treating yourself to something special.',
    image: 'https://picsum.photos/200',
    price: 45.99,
    category: 'Crafts',
    seller: 'Sarah\'s Crafts',
    rating: 4.8,
    reviews: 156,
    location: 'San Francisco, CA',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Organic Soap Set',
    description: 'Natural, handmade soaps using organic ingredients. These gentle cleansers are perfect for sensitive skin and come in various refreshing scents.',
    image: 'https://picsum.photos/201',
    price: 24.99,
    category: 'Beauty',
    seller: 'Natural Care Co.',
    rating: 4.6,
    reviews: 89,
    location: 'Portland, OR',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Knitted Winter Set',
    description: 'Cozy handknitted winter accessories including a scarf, hat, and mittens. Made with premium wool for maximum warmth and comfort.',
    image: 'https://picsum.photos/202',
    price: 59.99,
    category: 'Clothing',
    seller: 'Warm & Woolly',
    rating: 4.9,
    reviews: 203,
    location: 'Boston, MA',
    isAvailable: true
  }
];

export default function StoreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = mockStores.filter((store) => {
    const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <StoreList stores={filteredStores} />
      </View>
      <FooterNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F7',
  },
  content: {
    flex: 1,
  },
});