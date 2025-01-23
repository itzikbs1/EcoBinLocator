import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';



export default function LocationPermission({ onLocationReceived, onError }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getCurrentLocation() {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    const error = 'Permission to access location was denied';
                    setErrorMsg(error);
                    onError?.(error);
                    return;
                } 
                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                // setLocation(currentLocation);
                onLocationReceived?.(currentLocation);
            } catch(error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
                setErrorMsg(errorMessage);
                onError?.(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }

        getCurrentLocation();
    }, [])

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.paragraph}>Getting your location...</Text>
            </View>
        );
    }
    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={[styles.paragraph, styles.error]}>{errorMsg}</Text>
            </View>
        );
    }

    // return (
    //     <View style={styles.container}>
    //         {location && (
    //             <View>
    //                 <Text style={styles.paragraph}>Your Location:</Text>
    //                 <Text style={styles.coordinates}>
    //                     Latitude: {location.coords.latitude.toFixed(6)}
    //                 </Text>
    //                 <Text style={styles.coordinates}>
    //                     Longitude: {location.coords.longitude.toFixed(6)}
    //                 </Text>
    //             </View>
    //         )}
    //     </View>
    // )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    coordinates: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 5,
    },
    error: {
        color: 'red',
    },
});

// import { useState, useEffect } from "react";
// import { Platform, Text, View, StyleSheet } from "react-native";
// import * as Location from "expo-location";


// export default function getCoordinates() {
//     const [location, setLocation] = useState<Location.LocationObject | null>(null);
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);


//     useEffect(() => {
//         async function getCurrentLocation() {
            
//             let { status } = await Location.requestForegroundPermissionsAsync(); 

//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             setLocation(location);
//         }

//         getCurrentLocation();
//     }, []);

//     let text = 'Waiting...';
//     if (errorMsg) {
//         text = errorMsg;
//     } else if (location) {
//         text = JSON.stringify(location);
//     }

//     return (
//         <View style={StyleSheet.container}>
//             <Text style={styles.paragraph}>{text}</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 20,
//     },
//     paragraph: {
//       fontSize: 18,
//       textAlign: 'center',
//     },
//   });