import { Drawer } from 'expo-router/drawer';

export default function MainLayout() {
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
      }}
    >
      <Drawer.Screen
        name="bartender/index"
        options={{
          drawerLabel: "Đơn hàng mới",
          title: "Đơn hàng mới",
        }}
      />
      <Drawer.Screen
        name="bartender/preparing"
        options={{
          drawerLabel: "Đơn hàng đang thực hiện",
          title: "Đơn hàng đang thực hiện",
        }}
      />
      <Drawer.Screen
        name="bartender/completed"
        options={{
          drawerLabel: "Đơn hàng hoàn thành",
          title: "Đơn hàng hoàn thành",
        }}
      />
    </Drawer>
  );
}