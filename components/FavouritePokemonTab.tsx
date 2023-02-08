import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import UnfavouriteButton from "./UnfavouriteButton";
import Animated, {
  Easing,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { PanGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture";
import { PinchGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/pinchGesture";
import { FavouriteContext } from "../contexts/FavouriteContext";

interface Type {
  name: string;
}

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: Array<{
    [key: string]: Type;
  }>;
}

export default function FavouritePokemonTab() {
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();
  const [imageLink, setImageLink] = useState<string>();
  const [pokemonData, setPokemonData] = useState<PokemonData>();
  const [prev, setPrev] = useState<string | number | null>(null);
  const imageLinkPrefix =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const favouritePokemon = useContext(FavouriteContext).favouritePokemon;
  const setFavouritePokemon = useContext(FavouriteContext)
    .setFavouritePokemon as Dispatch<SetStateAction<string | number | null>>;
  useEffect(() => {
    if (favouritePokemon == null) {
      return;
    }
    (async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${favouritePokemon}`
        );
        const data = await response.json();
        setImageLink(`${imageLinkPrefix}${data.id}.png`);
        setPokemonData(data);
        console.log(data.species.url);
        const speciesResponse = await fetch(`${data.species.url}`);
        const speciesData = await speciesResponse.json();
        console.log(speciesData.evolves_from_species);
        if (speciesData.evolves_from_species)
          setPrev(speciesData.evolves_from_species.name);
        else setPrev(null);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    })();
  }, [favouritePokemon]);

  // const progress = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // useEffect(() => {
  //   progress.value = 0;
  //   progress.value = withRepeat(
  //     withTiming(1, { duration: 5000, easing: Easing.linear }),
  //     -1
  //   );
  // }, [favouritePokemon]);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      x.value += e.changeX;
      y.value += e.changeY;
      if (Math.log2(2 + Math.abs(y.value) / 256) > 1.7) {
        runOnJS(setFavouritePokemon)(prev);
        runOnJS(setForceRerender)(!forceRerender);
        x.value = 0;
        y.value = 0;
      }
    })
    .onEnd(() => ((x.value = withSpring(0)), (y.value = withSpring(0))));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: Math.log2(2 + Math.abs(x.value) / 256) },
        { scaleY: Math.log2(2 + Math.abs(y.value) / 256) },
        {
          translateX:
            Math.sign(x.value) * Math.log2(1 + Math.abs(x.value) ** 2),
        },
        {
          translateY:
            Math.sign(y.value) * Math.log2(1 + Math.abs(y.value) ** 2),
        },
      ],
    };
  });

  if (favouritePokemon == null)
    return (
      <View style={styles.container}>
        <Text style={styles.noPokemonText}>No favourite Pokemon chosen...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>error...</Text>
      </View>
    );
  if (loading)
    return (
      <View style={styles.container}>
        <Text style={styles.noPokemonText}>Loading...</Text>
      </View>
    );
  if (pokemonData)
    return (
      <View style={styles.favouriteContainer}>
        <Text style={styles.pokemonText}>{favouritePokemon}</Text>
        <GestureDetector gesture={panGesture}>
          <View>
            <Animated.Image
              key={favouritePokemon}
              style={[styles.favouritePokemonImage, animatedStyle]}
              source={{ uri: imageLink }}
            />
          </View>
        </GestureDetector>
        <View style={{ zIndex: 0 }}>
          <Text>height: {pokemonData.height * 10}cm</Text>
          <Text>
            weight:
            {pokemonData.weight > 10
              ? String(pokemonData.weight / 10) + "kg"
              : String(pokemonData.weight * 100) + "g"}
          </Text>
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text>Types: </Text>
            </View>
            <FlatList
              data={pokemonData.types}
              keyExtractor={(item) => item.type.name}
              renderItem={({ item }) => (
                <Text style={styles.listItem}>{item.type.name}</Text>
              )}
            />
          </View>
        </View>
        <UnfavouriteButton />
      </View>
    );
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  noPokemonText: {
    textAlign: "center",
  },
  errorText: {
    padding: 100,
  },
  favouriteContainer: {
    alignItems: "center",
  },
  favouritePokemonImage: {
    width: 256,
    height: 256,
    zIndex: 10,
  },
  pokemonText: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  listItem: {
    textAlign: "left",
  },
  listContainer: {
    flexDirection: "row",
  },
  listHeader: {
    justifyContent: "center",
  },
});
