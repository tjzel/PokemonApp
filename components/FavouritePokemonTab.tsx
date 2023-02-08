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
  cancelAnimation,
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

interface DevolveProps {
  setAboutToDevolve: Dispatch<SetStateAction<boolean>>;
  setFavouritePokemon: Dispatch<SetStateAction<string | number | null>>;
}

export default function FavouritePokemonTab() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();
  const [imageLink, setImageLink] = useState<string>();
  const [pokemonData, setPokemonData] = useState<PokemonData>();
  const [aboutToDevolve, setAboutToDevolve] = useState<boolean>(false);
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
        const speciesResponse = await fetch(`${data.species.url}`);
        const speciesData = await speciesResponse.json();
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

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const displacementX = useSharedValue(0);
  const displacementY = useSharedValue(0);
  const scale = useSharedValue(1);

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
      displacementX.value =
        Math.sign(x.value) * Math.log2(1 + Math.abs(x.value) ** 2);
      displacementY.value =
        Math.sign(y.value) * Math.log2(1 + Math.abs(y.value) ** 2);
      scale.value = Math.log2(2 + Math.sqrt(x.value ** 2 + y.value ** 2) / 256);
      if (scale.value > 1.8) {
        runOnJS(setAboutToDevolve)(true);
      }
    })
    .onEnd(
      () => (
        (displacementX.value = withSpring(0)),
        ((displacementY.value = withSpring(0)),
        (x.value = 0),
        (y.value = 0),
        (scale.value = withSpring(1)))
      )
    );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          translateX: displacementX.value,
        },
        {
          translateY: displacementY.value,
        },
      ],
    };
  });

  const devolve = (props: DevolveProps) => {
    props.setAboutToDevolve(false);
    props.setFavouritePokemon(prev);
    x.value = 0;
    y.value = 0;
  };

  useEffect(() => {
    if (scale.value != 1) {
      displacementX.value = withTiming(0, {
        duration: 1500,
        easing: Easing.bounce,
      });
      displacementX.value = withTiming(0, {
        duration: 1500,
        easing: Easing.bounce,
      });
      scale.value = withTiming(0, { duration: 2000 }, () =>
        runOnJS(devolve)({
          setAboutToDevolve: setAboutToDevolve,
          setFavouritePokemon: setFavouritePokemon,
        })
      );
    }
  }, [aboutToDevolve]);

  useEffect(() => {
    if (scale.value != 1) {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 2000 });
    }
  }, [favouritePokemon]);

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
        {aboutToDevolve ? (
          <View style={{ zIndex: 10 }}>
            <Animated.Image
              key={favouritePokemon}
              style={[styles.favouritePokemonImage, animatedStyle]}
              source={{ uri: imageLink }}
            />
          </View>
        ) : (
          <GestureDetector gesture={panGesture}>
            <View style={{ zIndex: 10 }}>
              <Animated.Image
                key={favouritePokemon}
                style={[styles.favouritePokemonImage, animatedStyle]}
                source={{ uri: imageLink }}
              />
            </View>
          </GestureDetector>
        )}
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
