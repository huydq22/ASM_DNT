import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import React, { useState } from 'react'


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'huyhaha@gmail.com' && password === '123') {
      navigation.replace('Main');
    } else {
      Alert.alert('Error', 'Invalid credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
            style={styles.logoStyle}
            source={require("./img/logo.jpg")}
          />
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' },
  logoStyle:  {width: 150,
    height: 150,
    backgroundColor: "red",
    alignSelf: "center"},
  title: { fontSize: 28, color: '#fff', marginBottom: 20 },
  input: { width: '80%', height: 50, backgroundColor: '#333', color: '#fff', marginBottom: 15, paddingHorizontal: 10, borderRadius: 8 },
  button: { width: '80%', height: 50, backgroundColor: '#ff8c00', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
  link: { color: '#ff8c00', marginTop: 15 },
});

export default LoginScreen;