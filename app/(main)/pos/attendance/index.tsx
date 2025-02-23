import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import LogoHeader from '../../../../components/staff/LogoHeader';
import Greeting from '../../../../components/staff/Greeting';
import RealTimeClock from '../../../../components/staff/RealTimeClock';
import LastCheckoutInfo from '../../../../components/staff/LastCheckoutInfo';
import CheckInOutButtons from '../../../../components/staff/CheckInOutButtons';
import StatisticLink from '../../../../components/staff/StatisticLink';
import { Stack } from 'expo-router';


const { height } = Dimensions.get('window');
const fontSize = responsiveFontSize(18);

function responsiveFontSize(size: any) {
    return size * (Dimensions.get('window').width / 375);
}

const AttendanceScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lastCheckOut, setLastCheckOut] = useState({
        time: '18:07:31',
        date: 'Tue, February 18th, 2025',
    });
    const employeeName = "Phuoc, Nguyen Hong";

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const handleCheckIn = () => {
        alert('Check IN!');
    };

    const handleCheckOut = () => {
        alert('Check OUT!');
    };

    const handleCheckStatistic = () => {
        alert('Check Statistic!');
    };

    return (
        <View style={styles.container}>
             <Stack.Screen
                    options={{
                      title: 'Chấm công',
                      headerStyle: {
                        backgroundColor: '#28a745',
                      },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                      },
                    }}
                  />
            <LogoHeader />
            <Greeting employeeName={employeeName} />
            <RealTimeClock currentTime={currentTime} />
            <LastCheckoutInfo lastCheckOut={lastCheckOut} />
            <CheckInOutButtons onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
            <StatisticLink onCheckStatistic={handleCheckStatistic} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: height * 0.08,
        backgroundColor: '#f9f9f9',
    },
});


export default AttendanceScreen

