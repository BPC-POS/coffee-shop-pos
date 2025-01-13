import React, { useState } from 'react';
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
    const [isHovered, setIsHovered] = useState(false);

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
                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        isHovered ? styles.loginButtonHover : {},
                    ]}
                    onPress={handleLogin}
                    onPressIn={() => setIsHovered(true)}
                    onPressOut={() => setIsHovered(false)}
                >
                    <Text style={[
                         styles.buttonText,
                         isHovered ? styles.buttonTextHover : {}
                         ]}>ĐĂNG NHẬP</Text>
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    title: {
        fontSize: 32,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        marginBottom: 30,
        fontFamily: 'Poppins-Regular',
    },
    loginButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    loginButtonHover: {
        backgroundColor: 'black',
    },
    buttonText: {
        color: 'black',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
    },
    buttonTextHover:{
        color: 'white'
    },
});