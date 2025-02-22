import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      console.log('Loaded cart data:', storedCart);
      const cartItems = storedCart ? JSON.parse(storedCart) : [];
      setCart(cartItems);
      calculateTotal(cartItems);
    } catch (error) {
      console.error("Error loading cart:", error);
      Alert.alert("Lỗi", "Không thể tải giỏ hàng");
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (itemId, size, newQuantity) => {
    try {
      if (newQuantity < 1) {
        Alert.alert(
          "Xóa sản phẩm",
          "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
          [
            {
              text: "Hủy",
              style: "cancel"
            },
            {
              text: "Xóa",
              onPress: () => removeItem(itemId, size)
            }
          ]
        );
        return;
      }

      const updatedCart = cart.map(item => {
        if (item.id === itemId && item.size === size) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (itemId, size) => {
    try {
      const updatedCart = cart.filter(item => !(item.id === itemId && item.size === size));
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
      Alert.alert("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSize}>Size: {item.size}</Text>
        <Text style={styles.itemPrice}>${((typeof item.price === 'number' ? item.price : 0) * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, item.size, item.quantity + 1)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => removeItem(item.id, item.size)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty</Text>
        }
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => navigation.navigate("PaymentScreen")}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#121212" 
  },
  title: { 
    fontSize: 24, 
    color: "#fff", 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center"
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  itemSize: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4
  },
  itemPrice: {
    color: "#FF8C00",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  quantityButton: {
    backgroundColor: "#333",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  quantity: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 8
  },
  removeButton: {
    marginLeft: 10
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 20,
    marginTop: 10
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right"
  },
  checkoutButton: {
    backgroundColor: "#FF8C00",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center"
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default CartScreen;
