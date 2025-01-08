import React, { ReactNode } from 'react';
import { View } from 'react-native';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default DefaultLayout;