<<<<<<< HEAD
import "./wdyr.tsx";
import { useState } from "react";
=======
import {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";
>>>>>>> master
import { StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import FavouritePokemonTab from "./components/FavouritePokemonTab";
import PokemonListTab from "./components/PokemonListTab";
import PokemonMapTab from "./components/PokemonMapTap";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
<<<<<<< HEAD
import { GestureHandlerRootView } from "react-native-gesture-handler";
=======
import { FavouriteContext } from "./contexts/FavouriteContext";
>>>>>>> master

export default function App() {
  const Tab = createBottomTabNavigator();
  const pokemonListIcon = require("./assets/pokemon-list-icon.png");
  const [favouritePokemon, setFavouritePokemon] = useState<
    string | number | null
  >(null);

  return (
<<<<<<< HEAD
    <GestureHandlerRootView style={{ flex: 1 }}>
=======
    <FavouriteContext.Provider
      value={{
        favouritePokemon: favouritePokemon,
        setFavouritePokemon: setFavouritePokemon,
      }}
    >
>>>>>>> master
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Favourite Pokemon">
          <Tab.Screen
            name="Favourite Pokemon"
<<<<<<< HEAD
=======
            component={FavouritePokemonTab}
>>>>>>> master
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
<<<<<<< HEAD
          >
            {(props) => (
              <FavouritePokemonTab
                favouritePokemon={favouritePokemon}
                setFavouritePokemon={setFavouritePokemon}
                {...props}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Pokemon List"
=======
          />
          <Tab.Screen
            name="Pokemon List"
            component={PokemonListTab}
>>>>>>> master
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
<<<<<<< HEAD
          >
            {(props) => (
              <PokemonListTab
                favouritePokemon={favouritePokemon}
                setFavouritePokemon={setFavouritePokemon}
                {...props}
              />
            )}
          </Tab.Screen>
=======
          />
>>>>>>> master
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
<<<<<<< HEAD
    </GestureHandlerRootView>
=======
    </FavouriteContext.Provider>
>>>>>>> master
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 28,
    width: 28,
  },
});
