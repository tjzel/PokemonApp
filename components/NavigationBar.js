import * as React from "react";
import { StyleSheet, View, Pressable } from "react-native";

export default function NavigationBar({ favouriteTab, pokemonTab, mapTab }) {
  return (
    <View style={styles.barContainer}>
      <Pressable style={styles.button} {...favouriteTab}>
        <Text>Favourite Pokemon</Text>
      </Pressable>
      <Pressable style={styles.button} {...pokemonTab}>
        <Text>Pokemon List</Text>
      </Pressable>
      <Pressable style={styles.button} {...mapTab}>
        <Text>Pokemon Map</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    width: "100%",
    height: 68,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 68,
  },
  button: {
    width: "30%",
    width: "80%",
  },
});
