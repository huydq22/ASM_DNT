import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email && password) {
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
       <Image
                  style={styles.logoStyle}
                  source={require("./img/logo.jpg")}
                />
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
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

export default RegisterScreen;
