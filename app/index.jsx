
import { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

import { indexColors } from './Colors';
import LocationPermission from './LocationPermission';
import RecyclingCategory from './RecyclingCategory';

export default function Index() {

  const [location, setLocation] = useState({});
  // const [binTypes, setBinType] = useState([]);
    
  const [binTypes, setBinTypes] = useState(['Plastic', 'Glass', 'Paper', 'Electronic', 'Textile', 'Packaging', 'Cardboard']);
  
  const router = useRouter();

  const handleError = (error) => {
    console.error('Location error:', error);
    Alert.alert('Error', 'Failed to get location. Please try again.');
  }
  
  const handleLocationReceived = (loc) => {
    setLocation(loc);
  }

  useEffect(() => {
    if (location) {
      setTimeout(() => {
        router.push({
        pathname: '/Map',
        params: {
          userLocation: JSON.stringify(location),
          selectedBinTypes: binTypes  
        }
        });
      }, 100);
    }
  }, [location])


  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recycling Assistant</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <LocationPermission
            onLocationReceived={handleLocationReceived}
            onError={handleError}
          />
        </View>        
      </View>
    </View>
    </SafeAreaView>
  )
}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: indexColors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: indexColors.border,
    backgroundColor: indexColors.background,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: indexColors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: indexColors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    color: indexColors.lightGray,
    textAlign: 'center',
    fontSize: 14,
  }
});