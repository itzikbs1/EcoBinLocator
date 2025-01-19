// import { Platform } from 'react-native';
import { API_URL } from '../../config/config';
// import { getVersion } from 'react-native-device-info';
// import { VersionInfo } from 'expo-constants';

// import { getVersion } from 'react-native-device-info';  
// import { useLocalSearchParams } from 'expo-router';

const findNearestBins = async ({ latitude, longitude, selectedBinTypes}) => {
    try {
        // console.log('API Request Parameters:', { latitude, longitude, selectedBinTypes });
        // console.log(`API_URL: ${API_URL}`);
        const requestBody = {
            coords: {
                latitude: latitude,
                longitude: longitude
            }, 
            binTypes: 
                selectedBinTypes
            }

        const response = await fetch(`${API_URL}/api/bins`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            // deviceInfo: {
            //     platform: Platform.OS,
            //     version: VersionInfo.appVersion
            // }
        });
        if (!response.ok) {
            // Try to get error details if available
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        const data = await response.json();
        return data;

    } catch(error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        console.error(error);
        throw error;
    }
}

export default findNearestBins;