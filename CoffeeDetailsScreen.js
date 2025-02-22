import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CoffeeDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params; // Nhận item từ HomeScreen
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
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

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ảnh sản phẩm */}
      <Image source={{ uri: item.image }} style={styles.detailImage} />

      <View style={styles.details}>
        {/* Tiêu đề + Icon yêu thích */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3333" : "#FF8C00"} 
            />
          </TouchableOpacity>
        </View>

        {/* Thông tin nguồn gốc và xếp hạng */}
        <Text style={styles.subtitle}>🌍 Origin: {item.origin || "Unknown"}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.rating}>⭐ {item.rating || "No rating"} ({item.reviews || 0} reviews)</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Coffee</Text>
            <Text style={styles.tag}>{item.origin || "Unknown"}</Text>
          </View>
        </View>

        {/* Mô tả sản phẩm */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Chọn Size */}
        <Text style={styles.sizeLabel}>Select Size</Text>
        <View style={styles.sizeContainer}>
          {["Small", "Medium", "Large"].map((size) => (
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

        {/* Giá & Nút thêm vào giỏ hàng */}
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

export default CoffeeDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1C1C" },
  detailImage: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  details: { padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, color: "#FFF", fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#CCC", marginVertical: 5 },
  infoContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  rating: { color: "#FFD700", fontSize: 16, fontWeight: "600" },
  tags: { flexDirection: "row" },
  tag: {
    backgroundColor: "#333",
    color: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
  },
  description: { color: "#AAA", fontSize: 14, marginVertical: 10, lineHeight: 22 },
  sizeLabel: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginTop: 15 },
  sizeContainer: { flexDirection: "row", marginVertical: 10 },
  sizeButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedSize: { backgroundColor: "#FF8C00" },
  sizeText: { color: "#FFF", fontSize: 16 },
  selectedSizeText: { fontWeight: "bold" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  price: { color: "#FF8C00", fontSize: 22, fontWeight: "bold" },
  addToCartButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  addToCartText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  }
});
