import React from 'react';
import { TouchableOpacity, View, StyleProp, ViewStyle} from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: StyleProp<ViewStyle>
}

const IconButton: React.FC<IconButtonProps> = ({
    children,
    onPress,
    size = 'medium',
    className = '',
    style
}) => {

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 30;


  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full items-center justify-center ${className}`}
      style={style}
    >
      <View>
          { React.Children.map(children, (child) => {
             return React.cloneElement(child as React.ReactElement, {
                size: iconSize
             })
           })}
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;