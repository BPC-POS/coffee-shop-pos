// src/components/StatisticLink.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (width / 375);
}

interface StatisticLinkProps {
    onCheckStatistic: () => void;
}

const StatisticLink: React.FC<StatisticLinkProps> = ({ onCheckStatistic }) => (
    <TouchableOpacity onPress={onCheckStatistic}>
        <Text style={styles.statisticLink}>Check Statistic</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    statisticLink: {
        fontSize: responsiveFontSize(18),
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default StatisticLink;