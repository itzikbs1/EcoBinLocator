
import { useState } from "react";
import { Pressable, Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import { useRouter } from "expo-router";

import { indexColors } from './Colors';
import LocationPermission from './LocationPermission';
import RecyclingCategory from './RecyclingCategory';
import Map from './Map';

export default function Index() {

  const [location, setLocation] = useState({});
  // const [binTypes, setBinType] = useState([]);
    
  const [binTypes, setBinType] = useState(['Plastic', 'Glass', 'Paper', 'Electronic', 'Textile', 'Packaging', 'Cardboard']);
  
  const router = useRouter();

  const handleError = (error) => {
    console.error('Location error:', error);
    Alert.alert('Error', 'Failed to get location. Please try again.');
  }

  const handlePress = () => {
    router.push({
      pathname: '/Map',
      params: {
        userLocation: JSON.stringify(location),
        selectedBinTypes: binTypes
      }
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recycling Assistant</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <LocationPermission
            onLocationReceived={setLocation}
            onError={handleError}
          />
        </View>

        {/* <Map /> */}

        <View style={styles.section}>
          <RecyclingCategory
            binTypes={setBinType}
            // onError={handleError}
          />
          {binTypes.length > 0 ? 
          (<Pressable 
            onPress={handlePress}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            accessibilityRole="button"
            accessibilityLabel="Find closest recycling bin"
          >
            <Text style={styles.buttonText}>Let's find the closest bin!</Text>
          </Pressable>)
          : (<Text style={styles.helperText}>Please select recycling categories to continue</Text>)
          }
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