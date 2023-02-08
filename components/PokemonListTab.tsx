import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect, useRef, Dispatch, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FavouriteContext } from "../contexts/FavouriteContext";

interface PokemonListElement {
  name: string;
  url: string;
}

export default function PokemonListTab() {
  const favouritePokemon = useContext(FavouriteContext).favouritePokemon;
  const setFavouritePokemon = useContext(FavouriteContext).setFavouritePokemon;
  const [pokemonList, setPokemonList] = useState<Array<PokemonListElement>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hotLoading, setHotLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();
  const offsetRef = useRef<number>(0);
  const listLoaded = useRef<boolean>(false);
  const limit = 40;

  const imageLinkPrefix =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        );
        const data = await response.json();
        setPokemonList(data.results);
        offsetRef.current += limit;
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.log(e);
      }
    })();
  }, []);

  function loadMore() {
    if (listLoaded.current) return;
    setHotLoading(true);
    (async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetRef.current}`
        );
        const data = await response.json();
        const count = data.results.length;
        setPokemonList(Array.prototype.concat(pokemonList, data.results));
        if (count == limit) offsetRef.current += limit;
        else listLoaded.current = true;
        setHotLoading(false);
      } catch (e) {
        setError(e);
        setHotLoading(false);
        console.log(e);
      }
    })();
  }

  function footer() {
    if (listLoaded.current) return <Text>List loaded!</Text>;
    return <Text>Loading</Text>;
  }

  return (
    <View style={styles.listContainer}>
      {loading && <Text>...</Text>}
      {error != undefined && <Text>Error...</Text>}
      {setFavouritePokemon && (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          onEndReachedThreshold={0.9}
          onEndReached={loadMore}
          ListFooterComponent={footer}
          renderItem={({ item }) => {
            const urlSplit = item.url.split("/");
            const id = urlSplit[urlSplit.length - 2];
            const imageLink = `${imageLinkPrefix}${id}.png`;
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
                    defaultSource={require("../assets/loading.gif")}
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
      )}
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
