// src/components/LastCheckoutInfo.tsx
import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (width / 375);
}

interface LastCheckoutInfoProps {
    lastCheckOut: { time: string, date: string };
}

const LastCheckoutInfo: React.FC<LastCheckoutInfoProps> = ({ lastCheckOut }) => (
    <Text style={styles.lastCheckout}>
        Your last Check-Out at <Text style={styles.lastCheckoutTime}>{lastCheckOut.time}, {lastCheckOut.date}</Text>
    </Text>
);

const styles = StyleSheet.create({
    lastCheckout: {
        fontSize: responsiveFontSize(16),
        color: '#333',
        marginBottom: height * 0.05,
    },
    lastCheckoutTime: {
        color: '#ff5722',
    },
});

export default LastCheckoutInfo;