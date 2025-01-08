import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

const OverviewScreen = () => {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')} 
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Chào mừng đến với Ứng dụng!</Text>
                <Text style={styles.welcomeText}>
                    Khám phá những điều thú vị đang chờ đón bạn.
                </Text>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default OverviewScreen;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)', // Tạo lớp nền mờ
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    welcomeText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});