// src/components/LogoHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const logoWidth = width * 0.25;
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: number) {
    return size * (width / 375);
}

const LogoHeader = () => (
    <View style={styles.logoContainer}>
        
        <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>TỐT NGHIỆP</Text>
            <Text style={styles.subtitle}>Time Tracking System</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.04,
    },
    logoImage: {
        width: logoWidth,
        height: logoWidth,
        marginRight: width * 0.02,
    },
    titleContainer: {
        flexDirection: 'column',
    },
    mainTitle: {
        fontSize: responsiveFontSize(36),
        fontWeight: 'bold',
        color: '#007bff',
    },
    subtitle: {
        fontSize: responsiveFontSize(16),
        color: '#333',
    },
});

export default LogoHeader;