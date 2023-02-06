import { useState, useEffect, Dispatch } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import UnfavouriteButton from "./UnfavouriteButton";

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
        <Image
          style={styles.favouritePokemonImage}
          source={{ uri: imageLink }}
        />
        <View>
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
