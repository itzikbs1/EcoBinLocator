import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";

// import Checkbox from '@react-native-community/checkbox';

import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

import { binColors } from './Colors';
import { findNearestBins } from './api/bins.js';

// import glassMarker from '../assets/images/glass-marker.jpg';
// import plasticMarker from '../assets/images/plastic-marker.jpeg';
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
  } from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

export default function Map() {
    const params = useLocalSearchParams();
    const [binsData, setBinsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [destination, setDestination] = useState({});
    // const [selectedBin, setSelectedBin] = useState(null);
    
    const [activeFiltered, setActiveFiltered] = useState(params.selectedBinTypes 
        ? params.selectedBinTypes.toString().split(',')
        : []);

    const sheetRef = useRef(null);
        
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);


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
                    selectedBinTypes: activeFiltered
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
    }, [latitude, longitude, selectedBinTypes, activeFiltered]);

    
 
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
    // onMapPress = (coordinates) => {
    //     setDestination(coordinates[1], coordinates[0])
    // }

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


    const FilterMenu = () => (
        <View style={styles.filterContainer}>
            {Object.entries(binColors).map(([type]) => (
                <TouchableOpacity
                    key={type}
                    style={styles.checkboxRow}
                    onPress={() => {
                        setActiveFiltered(curr => 
                            curr.includes(type)
                            ? curr.filter(t => t !== type)
                            : [...curr, type]
                        )
                    }}
                >
                    <View
                        style={[
                            styles.checkbox, 
                            activeFiltered.includes(type) && styles.checkboxChecked
                    ]} />
                    <View style={[styles.colorDot, { backgroundColor: handleColor(type) }]} />
                    <Text style={styles.label}>{type}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )


    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
      }, []);

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.menuButton} 
                    onPress={() => bottomSheetRef.current?.snapToIndex(0)}
                >
                    <Ionicons name="menu" size={24} color="black" />
                </TouchableOpacity>

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
                                handleViewPress(bin.location.coordinates);
                            }}                        
                        >
                            <View style={[styles.binPoint, { backgroundColor: handleColor(bin.bin_type_name) }]} />
                        </Marker>
                    ))}
                </MapView>

                <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={false}
                //    renderContent={() => <FilterMenu />}
                //    initialSnap={1}
            >
                <FilterMenu />
            </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
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
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    binPoint: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        elevation: 2
    },



    filterContainer: {
        padding: 16,
        backgroundColor: 'white',
        height: '100%'
      },
      checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
      },
      colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 8
      },
      label: {
        fontSize: 16
      },
      checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
      },
      checkboxChecked: {
        backgroundColor: '#000',
      },
});




// {/* <View>
// {/* Normal marker - smaller dot */}
// <View style={{
// backgroundColor: handleColor(bin.bin_type_name),
// width: 20,
// height: 20,
// borderRadius: 10,
// borderWidth: 1.5,
// borderColor: 'white',
// shadowColor: '#000',
// shadowOffset: { width: 0, height: 1 },
// shadowOpacity: 0.2,
// elevation: 2
// }} />

// {/* Info popup - more compact and styled */}
// {selectedBin === bin._id && (
//     <View style={{
//         backgroundColor: 'white',
//         padding: 8,
//         borderRadius: 6,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         elevation: 3,
//         width: 60,
//         height: 85,
//         position: 'absolute',
//         left: -50,
//         top: 25
//     }}>
//         <Image 
//             source={getMarkerImage(bin.bin_type_name)} 
//             style={{
//                 width: 40, 
//                 height: 40, 
//                 borderRadius: 4,
//                 marginBottom: 4
//             }} 
//         />
//         <Text style={{
//             fontWeight: '600',
//             fontSize: 12,
//             marginBottom: 2
//         }}>{bin.bin_type_name}</Text>
//         <Text style={{
//             fontSize: 11,
//             color: '#666'
//         }}>{bin.city_name}</Text>
//     </View>
// )}
// </View> */}