import React, {
  Dispatch,
  useRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { LatLng, Marker } from "react-native-maps";
import { MarkerData } from "./PokemonMapTap";

interface Post {
  results: PokemonListElement[];
  next: string;
}

interface PokemonListElement {
  name: string;
  url: string;
}

const imageLinkPrefix =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

interface Props {
  coords: LatLng;
  markers: MarkerData[];
  onPressEarly: Dispatch<SetStateAction<boolean>>;
  onPressLate: Dispatch<SetStateAction<MarkerData[]>>;
}

export default function PinPokemonMenu({
  coords,
  markers,
  onPressEarly,
  onPressLate,
}: Props) {
  const listData = useRef<PokemonListElement[]>([]);
  const pokeApiLink = useRef<string>("https://pokeapi.co/api/v2/pokemon");
  const [loading, setLoading] = useState<boolean>(false);
  const [hotLoading, setHotLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();

  // function loadList() {
  //   console.log("ll");
  //   const { data, error } = useFetch<Post>(pokeApiLink.current);
  //   if (error) return;
  //   if (data) {
  //     pokeApiLink.current = data.next;
  //     listData.current = Array.prototype.concat(listData.current, data.results);
  //   }
  // }

  function loadList() {
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(pokeApiLink.current);
        const data = await response.json();
        pokeApiLink.current = data.next;
        listData.current = Array.prototype.concat(
          listData.current,
          data.results
        );
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.log(e);
      }
    })();
  }

  function listElement(pokemon: PokemonListElement, index: number) {
    const urlSplit = pokemon.url.split("/");
    const id = urlSplit[urlSplit.length - 2];
    const imageLink = `${imageLinkPrefix}${id}.png`;
    return (
      <View style={styles.listElementContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            onPressEarly(false);
            const m: MarkerData = {
              latlng: coords,
              name: pokemon.name,
              url: imageLink,
            };
            onPressLate(Array.prototype.concat(markers, [m]));
          }}
        >
          <Text style={styles.listElementText}>
            {index + 1} {pokemon.name}
          </Text>
          <Image style={styles.icon} source={{ uri: imageLink }} />
        </Pressable>
      </View>
    );
  }

  useEffect(() => loadList(), []);

  return (
    <View style={styles.listContainer}>
      <FlashList
        renderItem={({ item, index }) => listElement(item, index)}
        ListEmptyComponent={<Text>Loading...</Text>}
        data={listData.current}
        estimatedItemSize={20}
        onEndReached={loadList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listElementContainer: {},
  listElementText: { textAlignVertical: "center" },
  listContainer: {
    height: 200,
    width: 200,
    borderWidth: 1,
  },
  button: {
    flexDirection: "row",
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
});
