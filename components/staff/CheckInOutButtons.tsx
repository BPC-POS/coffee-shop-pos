// src/components/CheckInOutButtons.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const buttonWidth = width * 0.4;
const buttonHeight = height * 0.12;
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (width / 375);
}

interface CheckInOutButtonsProps {
    onCheckIn: () => void;
    onCheckOut: () => void;
}

const CheckInOutButtons: React.FC<CheckInOutButtonsProps> = ({ onCheckIn, onCheckOut }) => (
    <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.checkButton, styles.checkInButton]} onPress={onCheckIn}>
            <Text style={styles.checkButtonText}>IN!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.checkButton, styles.checkOutButton]} onPress={onCheckOut}>
            <Text style={styles.checkButtonText}>OUT!</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        marginBottom: height * 0.06,
    },
    checkButton: {
        width: buttonWidth,
        height: buttonHeight,
        borderRadius: buttonHeight / 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: width * 0.02,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    checkInButton: {
        backgroundColor: '#00bcd4',
    },
    checkOutButton: {
        backgroundColor: '#ffeb3b',
    },
    checkButtonText: {
        fontSize: responsiveFontSize(24),
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default CheckInOutButtons;