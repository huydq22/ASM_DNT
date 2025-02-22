import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favItems = JSON.parse(storedFavorites);
        console.log('Loaded favorites:', favItems);
        setFavorites(favItems);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (itemId) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== itemId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const navigateToDetails = (item) => {
    navigation.navigate('BeanDetailsScreen', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigateToDetails(item)}
    >
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemOrigin}>Xuất xứ: {item.origin}</Text>
        <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => removeFavorite(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="heart" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm yêu thích</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={50} color="#aaa" />
            <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích</Text>
          </View>
        }
        contentContainerStyle={favorites.length === 0 && styles.emptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center'
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemOrigin: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4
  },
  itemPrice: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4
  },
  removeButton: {
    padding: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default FavoritesScreen;
