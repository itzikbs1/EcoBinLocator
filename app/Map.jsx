import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { CheckBox } from '@rneui/themed';

import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

import { binColors } from './Colors';
import { findNearestBins } from './api/bins.js';
import { binTypes } from './binTypes';


export default function Map() {
    const params = useLocalSearchParams();
    const [binsData, setBinsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const types = binTypes.map(item => item.value);

    
    const [activeFiltered, setActiveFiltered] = useState(params.selectedBinTypes 
        ? params.selectedBinTypes.toString().split(',')
        : []);


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


    const handleType = (item) => {
        const newFilteredItems = activeFiltered.includes(item)
            ? activeFiltered.filter(it => it !== item)
            : [...activeFiltered, item];

        setActiveFiltered(newFilteredItems);
    }

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
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Ionicons name={isOpen ? 'close' : 'menu'} size={24} color="black" />
                    <Text style={styles.menuText}>{isOpen ? 'Close Menu' : 'Open Menu'}</Text>
                </TouchableOpacity>

                <Modal
                    visible={isOpen}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsOpen(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={() => setIsOpen(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalContent}
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <FlatList
                                data={types}
                                renderItem={({ item }) => (
                                    <View style={styles.checkboxRow}>
                                    <CheckBox
                                        checked={activeFiltered.includes(item)}
                                        onPress={ () => handleType(item) }
                                        containerStyle={styles.checkbox}
                                    />
                                        <View style={[styles.colorDot, { backgroundColor: handleColor(item) }]} />
                                        <Text style={styles.label}>{item}</Text>
                                    </View>
                                )}
                                keyExtractor={item => item}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
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
            </View>
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
        margin: 0,
        padding: 0,
        alignSelf: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    menuButton: { 
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5
    },
    menuText: { 
        color: 'white', 
        marginLeft: 8 
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'flex-end',
        paddingTop: 80,
        paddingRight: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        width: '55%',
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        // overflow: 'hidden'
    },
});