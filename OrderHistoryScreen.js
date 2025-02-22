import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const [orderHistory, setOrderHistory] = useState([]);

  // Sử dụng useFocusEffect để load dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      loadOrderHistory();
    }, [])
  );

  const loadOrderHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('orderHistory');
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setOrderHistory(history);
        console.log('Loaded order history:', history);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng #{item.id.slice(-4)}</Text>
        <Text style={[
          styles.orderStatus,
          { color: item.status === 'Completed' ? '#4CAF50' : '#FF9800' }
        ]}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.orderDate}>
        Ngày đặt: {formatDate(item.date)}
      </Text>

      <View style={styles.itemsList}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>
              {product.name} ({product.size})
            </Text>
            <Text style={styles.itemQuantity}>x{product.quantity}</Text>
            <Text style={styles.itemPrice}>
              ${(product.price * product.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalAmount}>
          ${item.totalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Chưa có đơn hàng nào
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20
  },
  listContainer: {
    paddingBottom: 20
  },
  orderCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  orderId: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500'
  },
  orderDate: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  itemName: {
    color: '#fff',
    flex: 1,
    fontSize: 14
  },
  itemQuantity: {
    color: '#888',
    marginHorizontal: 8,
    fontSize: 14
  },
  itemPrice: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '500'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  totalAmount: {
    color: '#FF8C00',
    fontSize: 18,
    fontWeight: 'bold'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default OrderHistoryScreen;
