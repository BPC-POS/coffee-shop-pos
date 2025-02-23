// src/components/RealTimeClock.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (width / 375);
}

interface RealTimeClockProps {
    currentTime: Date;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({ currentTime }) => {
    const formatTime = (date: any) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (date: any) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <View>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    time: {
        fontSize: responsiveFontSize(60),
        fontWeight: 'bold',
        color: '#222',
        marginBottom: height * 0.01,
    },
    date: {
        fontSize: responsiveFontSize(22),
        color: '#555',
        marginBottom: height * 0.03,
    },
});

export default RealTimeClock;