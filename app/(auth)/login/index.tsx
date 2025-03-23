import React from 'react';
import LoginForm from '@/components/forms/LoginForm';
import { ImageBackground, View, StyleSheet } from 'react-native';

const LoginScreen = () => {
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.backgroundImage}
        >
                <View style={styles.overlay}>
                    <View style={styles.formContainer}>
                        <LoginForm />
                    </View>
                </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20, 
    },
    formContainer: {
        width: '99%', 
        maxWidth: 400, 
        padding: 20,
    },
});

export default LoginScreen;