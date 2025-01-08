import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import  Icon  from 'react-native-vector-icons/MaterialIcons';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  variant?: 'contained' | 'outlined';
  className?: string;
  startIcon?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  style,
  variant = 'contained',
  className = '',
  startIcon,
  fullWidth,
}) => {
  const buttonStyle = variant === 'contained'
    ? styles.containedButton
    : styles.outlinedButton;

  const widthStyle = fullWidth ? styles.fullWidth : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle, style, widthStyle]}
      className={className}
    >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
           {startIcon && (
            <Icon name={startIcon} size={20} color={variant === 'contained' ? '#fff': '#000'} style={{marginRight: 10}} />
            )}
            <Text style={styles.buttonText}>{children}</Text>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containedButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
    outlinedButton: {
      backgroundColor: 'transparent',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
    },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    textTransform: 'none',
    fontSize: 16
  },
  fullWidth: {
    width: '100%',
  }
});

export default Button;