import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = "6a596e75a951b56f7a2582db316d341d";

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    // console.log(permission);
    if (!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    setCity(location[0].district);
    const response = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const json = await response.json();
    setDays(json.daily);
    console.log(json);
  }
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather}>
        {/* {days.length === 0 ? "" : <View style={styles.day}></View>} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    backgroundColor: "#CCEEFF",
  },
  city: {
    flex: 1.2,
    justifyContent:"center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500", 
  },
  weather: {
    // flex : 3,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  }
})


