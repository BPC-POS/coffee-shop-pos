import React from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
    label: string;
    startIcon?: string;
    className?: string;
    type?: "text" | "password";
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>; // Giữ nguyên labelStyle là TextStyle
}

const Input: React.FC<InputProps> = ({
    label,
    startIcon,
    className,
    type = "text",
    style,
    labelStyle,
}) => {
    return (
        <View style={style} className={className}>
            <Text style={labelStyle} className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </Text>
            <View className="relative">
                {startIcon && (
                    <Icon
                        name={startIcon}
                        size={20}
                        color="gray"
                        style={{ position: 'absolute', top: 12, left: 10, zIndex: 1 }}
                    />
                )}
                <TextInput
                   secureTextEntry={type === "password"}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     style={{   // Apply inputStyle trực tiếp
                         backgroundColor: 'rgba(255, 255, 255, 0.5)',
                         borderRadius: 10,
                         paddingLeft: 40,
                       }}
                />
            </View>
        </View>
    );
};

export default Input;