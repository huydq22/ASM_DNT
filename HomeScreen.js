import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AxiosInstance from "./AxiosIntance";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [coffeeData, setCoffeeData] = useState([]);
  const [beansData, setBeansData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("Fetching data...");

        // Thử gọi API
        const coffeeResponse = await AxiosInstance.get('/coffeeData');
        const beansResponse = await AxiosInstance.get('/beansData');

        console.log('Raw Coffee Response:', coffeeResponse);
        console.log('Raw Beans Response:', beansResponse);

        // Xử lý dữ liệu coffee
        if (coffeeResponse && Array.isArray(coffeeResponse)) {
          const processedCoffeeData = coffeeResponse.map(item => ({
            ...item,
            id: item.id || Math.random().toString(),
            price: 7.99 // Giá cố định cho test
          }));
          console.log('Processed Coffee Data:', processedCoffeeData);
          setCoffeeData(processedCoffeeData);
        }

        // Xử lý dữ liệu beans
        if (beansResponse && Array.isArray(beansResponse)) {
          const processedBeansData = beansResponse.map(item => ({
            ...item,
            id: item.id || Math.random().toString(),
            price: 15.99 // Giá cố định cho test
          }));
          console.log('Processed Beans Data:', processedBeansData);
          setBeansData(processedBeansData);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        // Dữ liệu mẫu khi có lỗi
        const sampleCoffeeData = [
          {
            id: '1',
            name: 'Espresso',
            price: 5.99,
            image: 'https://example.com/espresso.jpg',
            description: 'Strong coffee',
            origin: 'Italy'
          }
        ];

        const sampleBeansData = [
          {
            id: '1',
            name: 'Arabica Beans',
            price: 15.99,
            image: 'https://example.com/arabica.jpg',
            description: 'Premium coffee beans',
            origin: 'Brazil'
          }
        ];

        setCoffeeData(sampleCoffeeData);
        setBeansData(sampleBeansData);
      }
    };

    getData();
  }, []);
  
    
  // Lọc coffee theo searchText
  const filteredCoffee = useMemo(() => {
    return coffeeData.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [coffeeData, searchText]);

  // Thêm hàm addToCart
  const addToCart = async (item, size = 'Medium') => { // size mặc định cho coffee
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartList = cart ? JSON.parse(cart) : [];

      const productToAdd = {
        id: item.id,
        name: item.name,
        price: item.price || 0,
        image: item.image,
        size: size,
        quantity: 1,
        origin: item.origin
      };

      const existingProductIndex = cartList.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === size
      );

      if (existingProductIndex !== -1) {
        cartList[existingProductIndex].quantity += 1;
        Alert.alert('Cập nhật giỏ hàng', `Đã tăng số lượng ${item.name} (${size})`);
      } else {
        cartList.push(productToAdd);
        Alert.alert('Thêm vào giỏ hàng', `${item.name} (${size}) đã được thêm vào giỏ hàng`);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartList));
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Ionicons name="menu-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('PersonalDetails')}
          style={styles.avatarButton}
        >
          <Image 
            source={require('./assets/images/avatar.jpg')} 
            style={styles.avatar}
            defaultSource={require('./assets/images/avatar.jpg')}
          />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.title}>Find the best coffee for you</Text>

      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder="Find Your Coffee..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Danh sách Coffee */}
      <Text style={styles.sectionTitle}>Coffee</Text>
      <FlatList
        data={filteredCoffee}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
              const itemWithPrice = {
                ...item,
                price: item.price || 5.99 // Đảm bảo luôn có giá
              };
              console.log("Navigating to CoffeeDetails with:", itemWithPrice);
              navigation.navigate("CoffeeDetailsScreen", { item: itemWithPrice });
            }}            
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.image}
              onError={(e) => console.log('Coffee image error:', e.nativeEvent.error)}
            />
            <Text style={styles.coffeeTitle}>{item?.name}</Text>
            <Text style={styles.description}>{item?.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${item.price ? item.price.toFixed(2) : '5.99'}
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(item, 'Medium')}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Danh sách Coffee Beans */}
      <Text style={styles.sectionTitle}>Coffee Beans</Text>
      <FlatList
        data={beansData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
              const itemWithPrice = {
                ...item,
                price: item.price || 15.99 // Đảm bảo luôn có giá
              };
              console.log("Navigating to BeanDetails with:", itemWithPrice);
              navigation.navigate("BeanDetailsScreen", { item: itemWithPrice });
            }}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.image}
              onError={(e) => console.log('Beans image error:', e.nativeEvent.error)}
            />
            <Text style={styles.coffeeTitle}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${item.price ? item.price.toFixed(2) : '15.99'}
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(item, '250g')}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#121212", 
    padding: 20,
    paddingTop: 60,
  },
  title: { 
    fontSize: 24,
    color: "#fff", 
    fontWeight: "bold", 
    marginBottom: 10,
  },

  // Search bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  search: { flex: 1, color: "#fff", padding: 10 },
  searchIcon: { marginRight: 5 },

  sectionTitle: { fontSize: 18, color: "#fff", marginVertical: 10 },

  // Card chung
  card: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    width: 160,
  },
  image: { width: 140, height: 140, borderRadius: 10 },
  coffeeTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 5 },
  description: { color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 5 },

  // Giá + nút thêm vào giỏ hàng
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  price: { color: "#ff8c00", fontSize: 16, fontWeight: "bold" },
  addButton: {
    backgroundColor: "#ff8c00",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default HomeScreen;