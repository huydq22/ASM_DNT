import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BeanDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [selectedSize, setSelectedSize] = useState('250g');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log("Received item in BeanDetailsScreen:", item); // Để debug
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteList = favorites ? JSON.parse(favorites) : [];
      setIsFavorite(favoriteList.some(fav => fav.id === item.id));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoriteList = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteList = favoriteList.filter(fav => fav.id !== item.id);
        Alert.alert('Đã xóa khỏi yêu thích', `${item.name} đã được xóa khỏi danh sách yêu thích`);
      } else {
        favoriteList.push(item);
        Alert.alert('Đã thêm vào yêu thích', `${item.name} đã được thêm vào danh sách yêu thích!`);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật danh sách yêu thích');
    }
  };

  const addToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartList = cart ? JSON.parse(cart) : [];

      const productToAdd = {
        id: item.id,
        name: item.name,
        price: item.price ? Number(item.price) : 0,
        image: item.image,
        size: selectedSize,
        quantity: 1,
        origin: item.origin
      };

      const existingProductIndex = cartList.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === selectedSize
      );

      if (existingProductIndex !== -1) {
        cartList[existingProductIndex].quantity += 1;
        Alert.alert('Cập nhật giỏ hàng', `Đã tăng số lượng ${item.name} (${selectedSize})`);
      } else {
        cartList.push(productToAdd);
        Alert.alert('Thêm vào giỏ hàng', `${item.name} (${selectedSize}) đã được thêm vào giỏ hàng`);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartList));
      navigation.navigate('CartScreen');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
    }
  };

  // Kiểm tra xem item có tồn tại không
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={typeof item?.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.detailImage} 
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item?.name || 'Không có tên'}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? "#FF3333" : "#FF8C00"} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>🌍 Xuất xứ: {item?.origin || 'Không xác định'}</Text>
        <Text style={styles.description}>{item?.description || 'Không có mô tả'}</Text>

        <Text style={styles.sizeLabel}>Chọn kích thước</Text>
        <View style={styles.sizeContainer}>
          {['250g', '500g', '1000g'].map(size => (
            <TouchableOpacity 
              key={size} 
              style={[styles.sizeButton, selectedSize === size && styles.selectedSize]} 
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>💲 {item.price ? Number(item.price).toFixed(2) : '0.00'}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartText}>🛒 Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1C1C1C' 
  },
  detailImage: { 
    width: '100%', 
    height: 320, 
    resizeMode: 'cover' 
  },
  details: { 
    padding: 20 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 26, 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#CCC', 
    marginVertical: 5 
  },
  description: { 
    color: '#AAA', 
    fontSize: 14, 
    marginVertical: 10 
  },
  sizeLabel: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 15 
  },
  sizeContainer: { 
    flexDirection: 'row', 
    marginVertical: 10 
  },
  sizeButton: { 
    backgroundColor: '#333', 
    padding: 10, 
    borderRadius: 15, 
    marginRight: 10 
  },
  selectedSize: { 
    backgroundColor: '#FF8C00' 
  },
  sizeText: { 
    color: '#FFF', 
    fontSize: 16 
  },
  selectedSizeText: { 
    fontWeight: 'bold' 
  },
  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20 
  },
  price: { 
    color: '#FF8C00', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  addToCartButton: { 
    backgroundColor: '#FF8C00', 
    padding: 12, 
    borderRadius: 12 
  },
  addToCartText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  }
});

export default BeanDetailsScreen;
