import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import các màn hình
import RegisterScreen from './RegisterScreen';
import LoginScreen from './loginScreen';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import BeanDetailsScreen from './BeanDetailsScreen';
import CoffeeDetailsScreen from './CoffeeDetailsScreen';
import FavoritesScreen from './FavoritesScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import PaymentScreen from './PaymentScreen';
import Setting from './Setting';
import PersonalDetails from './PersonalDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs chính trong ứng dụng
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1E1E1E' },
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App chính
export default function MainMain() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{headerShown: false}}  >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen}  />
        <Stack.Screen name="Main" component={MainTabs}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  />
        <Stack.Screen name="CoffeeDetailsScreen" component={CoffeeDetailsScreen}/>
        <Stack.Screen name="BeanDetailsScreen" component={BeanDetailsScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen}/>
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
