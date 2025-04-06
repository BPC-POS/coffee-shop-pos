import React, { useState, useEffect } from 'react'; 
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, Alert
} from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { signIn } from '../../api/auth';
import { getMe } from '../../api/member';
import { getRoles } from '../../api/role';
import { Role } from '@/types/User';

const { width, height } = Dimensions.get('window');

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [errorRoles, setErrorRoles] = useState<unknown>(null);
  const [memberData, setMemberData] = useState<any>(null); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRoleNameFromId = (roleId: number | null): string | null => {
    if (roleId === null || !roles) {
      return null;
    }
    const foundRole = roles.find(role => role.id === roleId);
    return foundRole ? foundRole.name : null;
  };

  useEffect(() => {
    if (roles && roles.length > 0 && memberData) {
      const roleId = memberData.employees && memberData.employees.length > 0
        ? memberData.employees[0].role_id
        : null;
      const roleName = getRoleNameFromId(roleId);

      if (roleName) {
        switch (roleName.toUpperCase()) {
          case "CASHIER":
            router.push('/pos');
            break;
          case "BARTENDER":
            router.push('/bartender');
            break;
          case "WAITER":
            router.push('/waiter');
            break;
          default:
            console.warn(`Unknown role: ${roleName}. Redirecting to default screen.`);
            router.push('/pos');
            Alert.alert("Unknown Role", `Your role "${roleName}" is not recognized.`);
        }
      } else {
        console.warn("No role name found for member.");
        router.push('/pos');
        Alert.alert("No Role Assigned", "No role was assigned to your account.");
      }
    }
  }, [roles, memberData, router]);

  const handleLogin = async () => {
    try {
      const signInResponse = await signIn(email, password);

      if (signInResponse.status >= 200 && signInResponse.status < 300) {
        setLoadingRoles(true);
        setErrorRoles(null);

        try {
          const rolesResponse = await getRoles();
          setRoles(rolesResponse.data); 

          const memberMeResponse = await getMe();
          const memberMeData = memberMeResponse.data;
          setMemberData(memberMeData);


          const roleId = memberMeData.employees && memberMeData.employees.length > 0
            ? memberMeData.employees[0].role_id
            : null;

          const roleName = getRoleNameFromId(roleId);

          setLoadingRoles(false);

        } catch (fetchRolesOrMeError) {
          setLoadingRoles(false);
          console.error("Error fetching roles or member profile after login:", fetchRolesOrMeError);
          setErrorRoles(fetchRolesOrMeError);
          Alert.alert("Fetch Error", "Failed to fetch roles or profile after login. Please try again.");
          router.push('/pos');
        }

      } else {
        console.error("Login failed:", signInResponse);
        Alert.alert("Login Failed", "Invalid email or password. Please try again.");
      }
    } catch (loginError: any) {
      console.error("Login error:", loginError);
      
      // Provide more specific error messages
      if (loginError.message && loginError.message.includes('Network Error')) {
        Alert.alert(
          "Connection Error", 
          "Unable to connect to the server. Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      } else if (loginError.response) {
        // The server responded with a status code outside the 2xx range
        if (loginError.response.status === 401) {
          Alert.alert("Login Failed", "Invalid email or password. Please try again.");
        } else {
          Alert.alert("Login Error", `Server error (${loginError.response.status}). Please try again later.`);
        }
      } else {
        Alert.alert("Login Error", "Could not connect to server. Please check your internet connection and try again.");
      }
    }
  };

  if (loadingRoles) {
    return <Text>Loading Roles...</Text>;
  }

  if (errorRoles) {
    return <Text>Error loading roles: {errorRoles instanceof Error ? errorRoles.message : 'Unknown error'}</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <BlurView
        intensity={100}
        style={styles.blurContainer}
        tint='dark'
      >
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputWrapper}>
          <Input
            startIcon="account-circle"
            label="Email/Phone Number"
            className="text-white"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.passwordInputContainer}>
          <View style={styles.inputWrapper}>
            <Input
              startIcon="key"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              className="text-white"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <IconButton onPress={togglePasswordVisibility} style={styles.iconButton}>
            <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color="white" />
          </IconButton>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.textLogin}>LOGIN</Text>
        </Button>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
    height: height * 0.55,
    borderRadius: 20,
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: 22,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  inputWrapper: {
    marginBottom: 10,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconButton: {
    position: 'absolute',
    top: 35,
    right: 10,
  },
  forgotPasswordButton: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: 'white',
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: height * 0.015,
  },
  textLogin: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: '600',
  },
});

export default LoginForm;