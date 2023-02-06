import { useState, useEffect, Dispatch } from "react";
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
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { PanGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture";
import { PinchGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/pinchGesture";

interface Props {
  favouritePokemon: string | number | null;
  setFavouritePokemon: Dispatch<string | number | null>;
}

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

export default function FavouritePokemonTab({
  favouritePokemon,
  setFavouritePokemon,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();
  const [imageLink, setImageLink] = useState<string>();
  const [pokemonData, setPokemonData] = useState<PokemonData>();
  const imageLinkPrefix =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
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
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    })();
  }, [favouritePokemon]);

  const progress = useSharedValue(0);
  // const [x,y] = useSharedValue

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }),
      -1
    );
  }, []);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    // .onBegin(() => console.log("on begin"))
    // .onStart(() => console.log("on start"))
    .onChange((e) => {
      x.value += e.changeX / Math.log2(2 + Math.abs(x.value));
      y.value += e.changeY / Math.log2(2 + Math.abs(y.value));
    })
    // .onUpdate((e) => console.log(e.absoluteX))
    .onEnd(() => ((x.value = withSpring(0)), (y.value = withSpring(0))));
  // .onFinalize(() => console.log("on finalize"));

  const pinchGesture = Gesture.Pinch().onChange((e) => {
    //scale.value *= e.scaleChange;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: 1 + Math.abs(x.value) / 64 },
        { scaleY: 1 + Math.abs(y.value) / 64 },
        { translateX: x.value },
        { translateY: y.value },
        // { scale: scale.value },
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
        <GestureDetector
          gesture={Gesture.Simultaneous(panGesture, pinchGesture)}
        >
          <Animated.Image
            key={favouritePokemon}
            style={[styles.favouritePokemonImage, animatedStyle]}
            source={{ uri: imageLink }}
          />
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
        <UnfavouriteButton setFavouritePokemon={setFavouritePokemon} />
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
  pokemonImage: {
    height: 256,
    width: 256,
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
