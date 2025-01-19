import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Drawer } from 'expo-router/drawer'; 
import { useRouter } from 'expo-router';

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const router = useRouter();

    const navigationView = (
        <View style={styles.drawerContainer}>
          <TouchableOpacity onPress={() => router.push('/orders')}>
            <Text style={styles.drawerItem}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={styles.drawerItem}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/pos')}>
            <Text style={styles.drawerItem}>POS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/schedule')}>
            <Text style={styles.drawerItem}>Schedule</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <Drawer 
        drawerContent={() => navigationView}
        screenOptions={{
          drawerPosition: 'left',
          drawerType: 'front',
          drawerStyle: {
            backgroundColor: '#fff',
            width: 250
          }
        }}
      >
        {children}
      </Drawer>
    );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
});

export default Sidebar;