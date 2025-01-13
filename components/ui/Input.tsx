import React from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
    label: string;
    startIcon?: string;
    className?: string;
    type?: "text" | "password";
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>
}

const getStylesFromClassname = (className: string) => {
    const styles: any = {};
    if (!className) return styles;

    const classNames = className.split(' ');

    classNames.forEach(name => {
       switch (name){
           case 'text-white':
             styles.color = 'white';
             break;
            case 'font-bold':
             styles.fontWeight = 'bold';
             break;
            case 'block':
             styles.display = 'flex';
             break;
            case 'text-sm':
                styles.fontSize = 14
                break;
           case 'mb-2':
                styles.marginBottom = 8
                break;
            default:
                break;
       }
    })
    return styles;
};

const Input: React.FC<InputProps> = ({
    label,
    startIcon,
    className,
    type = "text",
    style,
    labelStyle,
    inputStyle
}) => {
    const classnameStyles = getStylesFromClassname(className || '');
    const combinedLabelStyle = StyleSheet.flatten([classnameStyles, labelStyle]);
    return (
        <View style={style} className={className}>
            <Text style={combinedLabelStyle}>
                {label}
            </Text>
            <View className="relative">
                {startIcon && (
                    <Icon
                        name={startIcon}
                        size={24}
                        color="white"
                        style={{ position: 'absolute', top: 9, left: 10, zIndex: 1 }}
                    />
                )}
                <TextInput
                   secureTextEntry={type === "password"}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                     style={[
                         {   
                         backgroundColor: 'rgba(255, 255, 255, 0.5)',
                         borderRadius: 10,
                         paddingLeft: 40,
                         color: 'white', // Add this line for text color
                       },
                       inputStyle
                    ]}
                />
            </View>
        </View>
    );
};

export default Input;