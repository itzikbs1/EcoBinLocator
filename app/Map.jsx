import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import findNearestBins from './api/bins.js';
import { useState, useEffect } from 'react';

export default function Map() {
    const params = useLocalSearchParams();
    
    const [binsData, setBinsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Extract latitude and longitude from coords
    const parsedLocation = JSON.parse(params.userLocation);

    const latitude = parsedLocation?.coords?.latitude;
    const longitude = parsedLocation?.coords?.longitude;
    const selectedBinTypes = params.selectedBinTypes.split(',');


    useEffect(() => {
        const fetchBins = async () => {
            try {
                setLoading(true);
                const data = await findNearestBins({latitude, longitude, selectedBinTypes});
                setBinsData(data);
             
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBins();
        // if (latitude && longitude && selectedBinTypes.length > 0) {
        //     fetchBins();
        // }
    }, []); //latitude, longitude, selectedBinTypes


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Finding nearest bins...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Nearest Recycling Bins</Text>
                <Text>Your Location:</Text>
                <Text>Latitude: {latitude}</Text>
                <Text>Longitude: {longitude}</Text>
                <Text style={styles.text}>Selected Bin Types: {selectedBinTypes.join(', ')}</Text>
                
                {binsData && (
                    <View style={styles.binsContainer}>
                        <Text>Found {binsData.length} bins</Text>
                        {binsData.map((bin, index) => (
                            <View key={index} style={styles.binItem}>
                                <Text>Bin Type: {bin.bin_type_name}</Text>
                                <Text>Distance: {bin.distance}m</Text>
                                <Text>Location: {bin.location.coordinates[0]}, {bin.location.coordinates[1]}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        marginTop: 8,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    binsContainer: {
        marginTop: 16,
        width: '100%',
    },
    binItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        width: '100%'
    }
});