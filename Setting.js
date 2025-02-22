import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Setting = ({ navigation }) => {
  const menuItems = [
    {
      id: 'history',
      title: 'History',
      icon: 'time-outline',
      onPress: () => navigation.navigate('Main', { 
        screen: 'History' 
      })
    },
    {
      id: 'personal',
      title: 'Personal Details',
      icon: 'person-outline',
      onPress: () => navigation.navigate('PersonalDetails')
    },
    {
      id: 'address',
      title: 'Address',
      icon: 'location-outline',
      onPress: () => Alert.alert('Coming soon', 'This feature is under development')
    },
    {
      id: 'payment',
      title: 'Payment Method',
      icon: 'card-outline',
      onPress: () => navigation.navigate('PaymentScreen')
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('About', 'Coffee Shop App Version 1.0.0')
    },
    {
      id: 'help',
      title: 'Help',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help', 'Contact us at support@coffeeshop.com')
    },
    {
      id: 'logout',
      title: 'Log out',
      icon: 'log-out-outline',
      onPress: () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            },
          ]
        );
      }
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting</Text>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color="#FF8C00" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    marginTop: 20,
  },
  menuContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 15,
  },
});

export default Setting;
