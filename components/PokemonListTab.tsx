import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function PokemonListTab({
  favouritePokemon,
  setFavouritePokemon,
}) {
  const [pokemonList, setPokemonList] = useState([]); //should be a ref?
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const offsetRef = useRef(0);
  const limit = 20;

  const imageLinkPrefix =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=" + limit
        );
        const data = await response.json();
        setPokemonList(data.results);
        console.log(offsetRef.current);
        offsetRef.current += limit;
        console.log(offsetRef.current);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })(); // IIFE
  }, []);

  async function loadMore() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=" +
          limit +
          "&offset=" +
          offsetRef.current
      );
      console.log(
        // "https://pokeapi.co/api/v2/pokemon/?limit=" +
        //   limit +
        //   "&offset=" +
        //   offsetRef.current
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetRef.current}`
      );
      const data = await response.json();
      setPokemonList(Array.prototype.concat(pokemonList, data.results));
      console.log(offsetRef.current);
      offsetRef.current += limit;
      console.log(offsetRef.current);
      //setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.listContainer}>
      {loading && <Text>...</Text>}
      {error !== null && <Text>Error...</Text>}
      {
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          renderItem={({ item }) => {
            const urlSplit = item.url.split("/");
            const id = urlSplit[urlSplit.length - 2];
            const imageLink = imageLinkPrefix + id + ".png";
            if (item.name == favouritePokemon)
              return (
                <View style={styles.listElement} key={item.name}>
                  <Pressable onPress={() => setFavouritePokemon(item.name)}>
                    <FontAwesome
                      name="heart"
                      size={30}
                      color="red"
                      style={{ margin: 15 }}
                    />
                  </Pressable>
                  <Text style={styles.listFavouriteText}>{item.name}</Text>
                  <Image
                    style={styles.pokemonIcon}
                    source={{ uri: imageLink }}
                    // defaultSource={}
                  />
                </View>
              );
            return (
              <View style={styles.listElement} key={item.name}>
                <Pressable onPress={() => setFavouritePokemon(item.name)}>
                  <FontAwesome
                    name="heart-o"
                    size={30}
                    color="red"
                    style={{ margin: 15 }}
                  />
                </Pressable>
                <Text style={styles.listText}>{item.name}</Text>
                <Image style={styles.pokemonIcon} source={{ uri: imageLink }} />
              </View>
            );
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  listText: {
    textAlign: "left",
    textTransform: "uppercase",
    marginTop: 20,
  },
  listFavouriteText: {
    textAlign: "left",
    // textDecorationLine: "underline",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 20,
  },
  listElement: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    height: 64,
    borderTopLeftRadius: 6,
    borderWidth: 0.34,
    marginBottom: 10,
  },
  pokemonIcon: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
    margin: 10,
  },
});
