import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconButton from '@/components/ui/IconButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
    const router = useRouter();

    const handleBack = () => {
      router.back();
    };
  return (
    <View style={styles.container}>
          {showBackButton && (
            <IconButton onPress={handleBack} style={styles.backButton} >
              <Icon name="arrow-back" size={24} color="white" />
            </IconButton>
          )}
        
        {!showBackButton && (
           <IconButton onPress={() => console.log('Mở menu')} style={styles.menuButton}>
                <Icon name="menu" size={24} color="white" />
            </IconButton>
         )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#3498db',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
   menuButton: {
       marginRight: 8,
   },
    backButton: {
        marginRight: 8
    },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  
});

export default Header;