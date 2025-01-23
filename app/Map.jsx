import { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, Alert, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { findNearestBins } from './api/bins.js';


import glassMarker from '../assets/images/glass-marker.jpg';
import plasticMarker from '../assets/images/plastic-marker.jpeg';


export default function Map() {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    // console.log('====================================');
    // console.log(apiKey);
    // console.log('====================================');
    const router = useRouter();
    const params = useLocalSearchParams();
    const [binsData, setBinsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [destination, setDestination] = useState({});
    const [selectedBin, setSelectedBin] = useState(null);


    const userLocation = (() => {
        try {
            return params.userLocation ? JSON.parse(params.userLocation) : null;
        } catch (e) {
            console.error('Error parsing location:', e);
            return null;
        }
    })();

    const latitude = userLocation?.coords?.latitude ?? 0;
    const longitude = userLocation?.coords?.longitude ?? 0;
    const selectedBinTypes = params.selectedBinTypes 
        ? params.selectedBinTypes.toString().split(',')
        : [];

    useEffect(() => {
        const fetchBins = async () => {
            if (!latitude || !longitude || selectedBinTypes.length === 0) {
                setError('Invalid location or bin types');
                setLoading(false);
                return;
            }

            try {
                const data = await findNearestBins({
                    latitude,
                    longitude,
                    selectedBinTypes
                });
                setBinsData(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching bins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBins();
    }, [latitude, longitude, selectedBinTypes]);

    
 
    const handleViewPress = (coordinates) => {
        Alert.alert(
            "Open in Maps",
            "Would you like to open directions in Google Maps?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Open", 
                    onPress: () => {
                        const lat = coordinates[1];
                        const lng = coordinates[0];
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lat},${lng}&travelmode=walking`;
                        Linking.openURL(url).catch(err => {
                            console.error('Error opening maps:', err);
                            Alert.alert("Couldn't open maps");
                        });
                    }
                }
            ]
        );
    };
    onMapPress = (coordinates) => {
        setDestination(coordinates[1], coordinates[0])
    }

    const handleColor = (type) => {
        const colors = {
          Plastic: '#ff8c00', // Dark Orange
          Paper: '#964B00',   // Brown
          Glass: '#800080',   // Purple
          Electronic: '#808080', // Gray
          Textile: '#FF69B4',   // Pink
          Packaging: '#4B0082', // Indigo
          Cardboard: '#8B4513'  // Saddle Brown
        };
        return colors[type] || '#000000'; // Default black if type not found
    };

    const getMarkerImage = (binType) => {
        const images = {
            Glass: glassMarker,
            Plastic: plasticMarker
        };
        return images[binType] || null;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Finding nearest bins...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (!userLocation) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Location data is missing</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView 
                style={styles.map} 
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {binsData?.map((bin, index) => (
                    
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: bin.location.coordinates[1],
                            longitude: bin.location.coordinates[0],
                        }}
                        onPress={() => {
                            setSelectedBin(bin._id);
                            onMapPress(bin.location.coordinates);
                            handleViewPress(bin.location.coordinates);
                        }}                        
                    >
                            <View>
                                {/* Normal marker - smaller dot */}
                                <View style={{
                                    backgroundColor: handleColor(bin.bin_type_name),
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 1.5,
                                    borderColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    elevation: 2
                                }} />

                                {/* Info popup - more compact and styled */}
                                {selectedBin === bin._id && (
                                        <View style={{
                                            backgroundColor: 'white',
                                            padding: 8,
                                            borderRadius: 6,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
                                            elevation: 3,
                                            width: 60,
                                            height: 85,
                                            position: 'absolute',
                                            left: -50,
                                            top: 25
                                        }}>
                                            <Image 
                                                source={getMarkerImage(bin.bin_type_name)} 
                                                style={{
                                                    width: 40, 
                                                    height: 40, 
                                                    borderRadius: 4,
                                                    marginBottom: 4
                                                }} 
                                            />
                                            <Text style={{
                                                fontWeight: '600',
                                                fontSize: 12,
                                                marginBottom: 2
                                            }}>{bin.bin_type_name}</Text>
                                            <Text style={{
                                                fontSize: 11,
                                                color: '#666'
                                            }}>{bin.city_name}</Text>
                                        </View>
                                )}
                            </View>
                    </Marker>
                ))}
                {/* {destination.length === 2 && (
                    <MapViewDirections
                        origin={{latitude, longitude}}
                        destination={destination}
                        apikey={apiKey}
                        mode="WALKING"
                        strokeWidth={2}
                        strokeColor="hotpink"
                        // optimizeWaypoints={true}
                        onError={(errorMessage) => {
                        // console.log('GOT AN ERROR');
                        }}
                    />
                )} */}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    }
});