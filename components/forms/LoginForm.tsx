import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Dimensions 
} from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    router.push('/pos');
  };

  const handleScreenWaiter = () => {  
    router.push('/waiter');
  };

  const handleScreenBartender = () => {
    router.push('/(main)/bartender');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <BlurView
        intensity={100}
        style={styles.blurContainer}
        tint='dark'
      >
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputWrapper}>
          <Input startIcon="account-circle" label="Email/Phone Number" className="text-white" />
        </View>

        <View style={styles.passwordInputContainer}>
          <View style={styles.inputWrapper}>
            <Input
              startIcon="key"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              className="text-white" 
            />
          </View>
          <IconButton onPress={togglePasswordVisibility} style={styles.iconButton}>
            <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color="white" />
          </IconButton>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.textLogin}>LOGIN</Text>
        </Button>

        <Button onPress={handleScreenBartender} style={styles.loginButton}>
          <Text style={styles.textLogin}>Pha chế</Text>
        </Button>

        <Button onPress={handleScreenWaiter} style={styles.loginButton}>
          <Text style={styles.textLogin}>Phục vụ</Text>
        </Button>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    padding: 20,
    width: width * 0.9, // Chiếm 90% màn hình
    maxWidth: 400,
    height: height * 0.55, // Chiếm 55% chiều cao màn hình
    borderRadius: 20,
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    marginBottom: 22,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  inputWrapper: {
    marginBottom: 10,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconButton: {
    position: 'absolute',
    top: 35,
    right: 10,
  },
  forgotPasswordButton: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: 'white',
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    borderRadius: 10,
    marginTop: 10, // Thêm khoảng cách giữa các nút
    paddingVertical: height * 0.015, // Điều chỉnh kích thước nút theo màn hình
  },
  textLogin: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: '600',
  },
});

export default LoginForm;
