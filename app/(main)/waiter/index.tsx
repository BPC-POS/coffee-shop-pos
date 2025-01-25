import React from 'react';
import { StyleSheet, View } from 'react-native';
import AreaTableScreen from './Tables/index'; // Đảm bảo đúng đường dẫn tới AreaTableScreen

const WaiterScreen = () => {
  return (
    <View style={styles.container}>
      <AreaTableScreen />
    </View>
  );
};

export default WaiterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
