import { useState } from "react";
import { StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import FavouritePokemonTab from "./components/FavouritePokemonTab";
import PokemonListTab from "./components/PokemonListTab";
import PokemonMapTab from "./components/PokemonMapTap";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FavouriteContext } from "./contexts/FavouriteContext";

export default function App() {
  const Tab = createBottomTabNavigator();
  const pokemonListIcon = require("./assets/pokemon-list-icon.png");
  const [favouritePokemon, setFavouritePokemon] = useState<
    string | number | null
  >(null);

  return (
    <FavouriteContext.Provider
      value={{
        favouritePokemon: favouritePokemon,
        setFavouritePokemon: setFavouritePokemon,
      }}
    >
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
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/287/287221.png",
                    }}
                  />
                );
              },
            }}
          />
          <Tab.Screen
            name="Pokemon List"
            component={PokemonListTab}
            options={{
              tabBarIcon: () => {
                return (
                  <Image
                    style={[styles.icon, { width: 48 }]}
                    source={pokemonListIcon}
                  />
                );
              },
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
                    source={{
                      uri: "https://cdn0.iconfinder.com/data/icons/pokemon-go-vol-2/135/_Pokemon_Location-512.png",
                    }}
                  />
                );
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavouriteContext.Provider>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 28,
    width: 28,
  },
});
