import React from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TextStyle, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
    label: string;
    startIcon?: string;
    className?: string; // Still keeping className for now, but will refactor to remove later if desired for cleaner RN code
    type?: "text" | "password";
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>
}

// Removed getStylesFromClassname function for cleaner approach, will use styles directly and className for basic text color if needed.
// If className is fully removed, text color and font styling should be handled through labelStyle and inputStyle props directly.

const Input: React.FC<InputProps> = ({
    label,
    startIcon,
    className,
    type = "text",
    style,
    labelStyle,
    inputStyle
}) => {
    // const classnameStyles = getStylesFromClassname(className || ''); // No longer using this
    // const combinedLabelStyle = StyleSheet.flatten([classnameStyles, labelStyle]); // No longer using classnameStyles here

    const textColorStyle = className?.includes('text-white') ? styles.textWhite : null; // Basic className text-white handling, can be removed if className prop is fully removed.
    const combinedLabelStyle = StyleSheet.flatten([textColorStyle, labelStyle, styles.label]); // Apply textWhite style if className has it, labelStyle prop and default label style
    const combinedInputStyle = StyleSheet.flatten([styles.inputBase, textColorStyle, inputStyle]); // Apply textWhite to input as well, inputStyle prop and base input style

    return (
        <View style={[styles.container, style]} className={className}> {/* Apply container style and style prop */}
            <Text style={combinedLabelStyle}>
                {label}
            </Text>
            <View style={styles.inputWrapper} className="relative"> {/* Apply inputWrapper style */}
                {startIcon && (
                    <Icon
                        name={startIcon}
                        size={24} // Keep size as is, can be adjusted if needed responsively later with Dimensions.get('window').width * 0.06 for example
                        color="white" // Keep color as is
                        style={styles.icon} // Apply icon style
                    />
                )}
                <TextInput
                   secureTextEntry={type === "password"}
                    style={combinedInputStyle} // Apply combined input styles
                    placeholderTextColor="rgba(255, 255, 255, 0.7)" // Optional: Add placeholder text color for better visibility on blur
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, // Default margin bottom for input container
    },
    label: {
        fontSize: 16, // Default label font size
        marginBottom: 5, // Spacing between label and input
        color: 'white', // Default label color, adjust as needed
        fontFamily: 'Poppins-Regular', // Example font, ensure it's loaded
    },
    textWhite: {
        color: 'white', // Style for text-white className if you keep className prop
    },
    inputWrapper: {
        position: 'relative', // For positioning the icon absolutely
    },
    icon: {
        position: 'absolute',
        top: 9, // Adjust as needed to vertically center icon in input
        left: 10, // Adjust as needed for left padding of icon
        zIndex: 1,
    },
    inputBase: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        paddingLeft: 40, // Space for icon, adjust if icon size or position changes
        paddingVertical: 8, // Vertical padding for input, adjust for comfortable text area
        color: 'white', // Default input text color
        fontSize: 16, // Default input font size
        fontFamily: 'Poppins-Regular', // Example font, ensure it's loaded
        // Platform specific adjustments for input height and padding if needed
        ...Platform.select({
            ios: {
                height: 38, // Adjust input height for iOS if needed
                paddingVertical: 9, // Adjust vertical padding for iOS for better alignment
            },
            android: {
                height: 44, // Adjust input height for Android if needed
                paddingVertical: 10, // Adjust vertical padding for Android for better alignment
            },
        }),
    },
});


export default Input;