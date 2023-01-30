import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavouritePokemonTab from './components/FavouritePokemonTab';
import PokemonListTab from './components/PokemonListTab';
import PokemonMapTab from './components/PokemonMapTap';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

export default function App() {

  const Tab = createBottomTabNavigator();
  const pokemonListIcon = require('./assets/pokemon-list-icon.png');
  const [favouritePokemon, setFavouritePokemon] = React.useState(null); //how to pass it?

  return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Favourite Pokemon">
          <Tab.Screen
            name="Favourite Pokemon"
            component={FavouritePokemonTab}
            options={{
              tabBarIcon: () => {
                return (
                  <Image
                    style={[styles.icon]}
                    source={{uri:'https://cdn-icons-png.flaticon.com/512/287/287221.png'}}
                  />
                )
              }
            }}
          />
          <Tab.Screen 
            name="Pokemon List" 
            component={PokemonListTab}
            options={{
              tabBarIcon: () => {
                return (
                  <Image
                    style={[styles.icon, {width: 48}]}
                    source={pokemonListIcon}
                  />
                )
              }
            }}
          />
          <Tab.Screen 
            name="Pokemon Map" 
            component={PokemonMapTab}
            options={{
              tabBarIcon: () => {
                return (
                  <Image
                    style={[styles.icon]}
                    source={{uri:'https://cdn0.iconfinder.com/data/icons/pokemon-go-vol-2/135/_Pokemon_Location-512.png'}}
                  />
                )
              }
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: 320,
    maxWidth: 320,
    height: 320,
    width: 320,
    borderRadius: 18,
  },
  someScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 20,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    height: 28,
    width: 28,
  },
});
