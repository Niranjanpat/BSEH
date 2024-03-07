import { useState, useEffect } from 'react'
import { Platform, Alert, PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

export default () => {
    const [response, setResponse] = useState()

    useEffect(  ()  => {
        requestLocationPermission()
    }, [])

    async function  requestLocationPermission () {
        if(Platform.OS=='ios'){
            Geolocation.requestAuthorization('always');
            getCurrentLocation()
        }
        else{
            const granted = await PermissionsAndroid.request(
                
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'Access Location Permission',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation()
            }
            else{
            requestLocationPermission()
            }
        }
    }

    function getCurrentLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                setResponse({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        )
    }

    return [requestLocationPermission]
}
