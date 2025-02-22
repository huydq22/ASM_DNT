import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ navigation }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const cart = storedCart ? JSON.parse(storedCart) : [];
      setCartItems(cart);
      const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa Card',
      icon: 'card-outline',
      image: require('./assets/images/visa.jpg'),
      cardBg: '#1A1F71', // Màu nền thẻ Visa
      cardNumber: '**** **** **** 4242',
      cardHolder: 'NGUYEN VAN A',
      expiry: '12/24'
    },
    {
      id: 'mastercard',
      name: 'Master Card',
      icon: 'card-outline',
      image: require('./assets/images/mastercard.jpg'),
      cardBg: '#EB001B', // Màu nền MasterCard
      cardNumber: '**** **** **** 5555',
      cardHolder: 'TRAN THI B',
      expiry: '10/25'
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: 'wallet-outline',
      image: require('./assets/images/momo.jpg'),
      cardBg: '#A50064', // Màu nền MoMo
      cardNumber: '0912 345 678',
      cardHolder: 'LE VAN C',
      expiry: ''
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'cash-outline',
      cardBg: '#4CAF50', // Màu nền COD
    }
  ];

  const getSelectedCard = () => {
    return paymentMethods.find(method => method.id === selectedPayment) || paymentMethods[0];
  };

  const saveOrderHistory = async () => {
    if (!selectedPayment) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      const storedHistory = await AsyncStorage.getItem('orderHistory');
      let orderHistory = storedHistory ? JSON.parse(storedHistory) : [];

      const newOrder = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cartItems,
        totalAmount: totalPrice,
        paymentMethod: selectedPayment,
        status: 'Completed'
      };

      orderHistory.unshift(newOrder);
      await AsyncStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      await AsyncStorage.setItem('cart', JSON.stringify([]));

      Alert.alert(
        "Thanh toán thành công",
        "Cảm ơn bạn đã mua hàng!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert("Lỗi", "Không thể hoàn tất thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thanh toán</Text>
        <Text style={styles.subtitle}>Chọn phương thức thanh toán</Text>
      </View>

      <View style={styles.cardPreview}>
        {selectedPayment && selectedPayment !== 'cod' ? (
          <View style={[styles.card, { backgroundColor: getSelectedCard().cardBg }]}>
            <View style={styles.cardHeader}>
              <Image source={require('./assets/images/chip.jpg')} style={styles.chipImage} />
              {getSelectedCard().image && (
                <Image 
                  source={getSelectedCard().image} 
                  style={styles.cardLogo}
                />
              )}
            </View>
            <Text style={styles.cardNumber}>
              {getSelectedCard().cardNumber || '**** **** **** ****'}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardName}>
                  {getSelectedCard().cardHolder || 'CARD HOLDER'}
                </Text>
              </View>
              {getSelectedCard().expiry && (
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardExpiry}>{getSelectedCard().expiry}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
            <View style={styles.codCard}>
              <Ionicons name="cash-outline" size={50} color="#FFF" />
              <Text style={styles.codText}>Cash on Delivery</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.paymentMethods}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedPayment === method.id && styles.selectedPayment
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            {method.image ? (
              <Image source={method.image} style={styles.methodImage} />
            ) : (
              <Ionicons name={method.icon} size={24} color="#FFF" />
            )}
            <Text style={styles.methodText}>{method.name}</Text>
            <View style={styles.radioButton}>
              {selectedPayment === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !selectedPayment && styles.disabledButton]}
        onPress={saveOrderHistory}
        disabled={!selectedPayment}
      >
        <Text style={styles.payButtonText}>Thanh toán ngay</Text>
        <Text style={styles.payButtonAmount}>${totalPrice.toFixed(2)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  cardPreview: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  cardLogo: {
    width: 60,
    height: 40,
    resizeMode: 'contain'
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  cardName: {
    color: '#FFF',
    fontSize: 16,
    textTransform: 'uppercase'
  },
  cardExpiry: {
    color: '#FFF',
    fontSize: 16,
  },
  codCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },
  paymentMethods: {
    padding: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedPayment: {
    backgroundColor: '#2C2C2C',
    borderColor: '#FF8C00',
    borderWidth: 1,
  },
  methodImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 15,
  },
  methodText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
  },
  summary: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    margin: 20,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 16,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FF8C00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#FF8C00',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButtonAmount: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
