import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function UnfavouriteButton({ setFavouritePokemon }) {
  const [inProgress, setInProgress] = useState(false);

  if (inProgress == false)
    return (
      <Pressable style={styles.button} onPress={() => setInProgress(true)}>
        <FontAwesome name="trash-o" size={30} color="black" />
        <Text style={styles.buttonText}>unfavourite</Text>
      </Pressable>
    );
  return (
    <Pressable style={styles.button} onPress={() => setFavouritePokemon(null)}>
      <FontAwesome name="trash-o" size={30} color="black" />
      <Text style={styles.buttonText}>are you sure?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    textTransform: "uppercase",
    fontSize: 10,
  },
});
