import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  children: React.ReactNode;
}

const BartenderLayout: React.FC<Props> = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  const handleBackToPos = () => {
    router.push('/(main)/pos');
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8b4513',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
        drawerActiveTintColor: '#8b4513',
        drawerInactiveTintColor: '#666',
      }}
      drawerContent={(props) => (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToPos}
          >
            <Text style={styles.backButtonText}>
              Quay lại POS
            </Text>
          </TouchableOpacity>

          <View style={styles.menuContainer}>
            {props.state.routeNames.map((name, index) => (
              <TouchableOpacity
                key={name}
                style={[
                  styles.menuItem,
                  props.state.index === index && styles.activeMenuItem
                ]}
                onPress={() => props.navigation.navigate(name)}
              >
                <Text
                  style={[
                    styles.menuText,
                    props.state.index === index && styles.activeMenuText
                  ]}
                >
                  {name === 'index' ? 'Đơn hàng mới' :
                   name === 'preparing/index' ? 'Đơn hàng đang thực hiện' :
                   name === 'completed/index' ? 'Đơn hàng hoàn thành' :
                   ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Đơn hàng mới",
          title: "Đơn hàng mới",
        }}
      />
      <Drawer.Screen
        name="preparing/index"
        options={{
          drawerLabel: "Đơn hàng đang thực hiện",
          title: "Đơn hàng đang thực hiện",
        }}
      />
      <Drawer.Screen
        name="completed/index"
        options={{
          drawerLabel: "Đơn hàng hoàn thành",
          title: "Đơn hàng hoàn thành",
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#8b4513',
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  activeMenuItem: {
    backgroundColor: '#f0f0f0',
  },
  menuText: {
    color: '#666',
  },
  activeMenuText: {
    color: '#8b4513',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BartenderLayout; 