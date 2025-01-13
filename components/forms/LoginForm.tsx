import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { t } from 'react-native-tailwindcss';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTest = () => {
    router.push('/pos');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <BlurView
        intensity={100}
        style={[styles.blurContainer]}
        tint='dark'
      >
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.inputWrapper}>
          <Input startIcon="account-circle" label="Email/Phone Number"  className="text-white"/>
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
            {showPassword ? (
              <Icon name="visibility-off" size={20} color="white" />
            ) : (
              <Icon name="visibility" size={20} color="white" />
            )}
          </IconButton>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button style={styles.loginButton} onPress={handleTest}>
           <Text style={styles.textLogin}>LOGIN</Text>
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
      width: '95%',
      height: 400,
      maxWidth: 400,
      borderRadius: 20, 
    },
    title: {
        fontSize: 32,
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
        right: 10,
        top: 26,
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
    },
    textLogin: {
      color: 'white',
      fontSize: 23,
      fontWeight: '600',
    },
});

export default LoginForm;