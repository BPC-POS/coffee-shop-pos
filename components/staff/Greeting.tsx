// src/components/Greeting.tsx
import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (width / 375);
}

interface GreetingProps {
    employeeName: string;
}

const Greeting: React.FC<GreetingProps> = ({ employeeName }) => (
    <Text style={styles.greeting}>Hi, {employeeName}</Text>
);

const styles = StyleSheet.create({
    greeting: {
        fontSize: responsiveFontSize(20),
        color: '#333',
        marginBottom: height * 0.02,
        alignSelf: 'flex-end',
        marginRight: width * 0.05,
    },
});

export default Greeting;