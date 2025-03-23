import React from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TextStyle, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
    label: string;
    startIcon?: string;
    className?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    type?: "text" | "password";
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>
}

const Input: React.FC<InputProps> = ({
    label,
    startIcon,
    className,
    type = "text",
    style,
    labelStyle,
    inputStyle,
    value,
    onChangeText,
}) => {

    const textColorStyle = className?.includes('text-white') ? styles.textWhite : null;
    const combinedLabelStyle = StyleSheet.flatten([textColorStyle, labelStyle, styles.label]);
    const combinedInputStyle = StyleSheet.flatten([styles.inputBase, textColorStyle, inputStyle]);

    return (
        <View style={[styles.container, style]} className={className}>
            <Text style={combinedLabelStyle}>
                {label}
            </Text>
            <View style={styles.inputWrapper} className="relative">
                {startIcon && (
                    <Icon
                        name={startIcon}
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                )}
                <TextInput
                   secureTextEntry={type === "password"}
                    style={combinedInputStyle}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    textWhite: {
        color: 'white',
    },
    inputWrapper: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        top: 9,
        left: 10,
        zIndex: 1,
    },
    inputBase: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        paddingLeft: 40,
        paddingVertical: 8,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        ...Platform.select({
            ios: {
                height: 38,
                paddingVertical: 9,
            },
            android: {
                height: 44,
                paddingVertical: 10,
            },
        }),
    },
});

export default Input;