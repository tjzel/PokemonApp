import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Modal, Text, Alert, Pressable } from "react-native";
import MapView, { LatLng, Marker, Point } from "react-native-maps";
import PinPokemonMenu from "./PinPokemonMenu";

export interface MarkerData {
  latlng: LatLng;
  name: string;
  url: string;
}

export default function PokemonMapTab() {
  const [markers, setMarkers] = useState<Array<MarkerData>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const coords = useRef<LatLng>({ longitude: 0, latitude: 0 });

  // useEffect(() => {
  //   const m: MarkerData = {
  //     latlng: {
  //       latitude: 50.0486442,
  //       longitude: 19.9654474,
  //     },
  //     title: "debug",
  //     description: "debug",
  //   };
  //   setMarkers([m]);
  // }, []);

  // idealnie, to modal się mountuje po long pressie i potem unmountuje, ale nie umiem tego teraz zrobić

  function addMarker(coordinates: LatLng) {
    // const m: MarkerData = {
    //   latlng: coordinates,
    // };
    // setMarkers(Array.prototype.concat(markers, [m]));
    // console.log("long press!");
    coords.current = coordinates;
    setModalVisible(true);
  }

  const PinPokemonModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Choose a pokemon to pin!</Text>
            <PinPokemonMenu
              coords={coords.current}
              markers={markers}
              onPressEarly={setModalVisible}
              onPressLate={setMarkers}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50.0486442,
          longitude: 19.9654474,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        }}
        onLongPress={(e) => addMarker(e.nativeEvent.coordinate)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.name}
            image={{ width: 20, height: 20, uri: marker.url }} // refuses to get sized...
            draggable={true}
          />
        ))}
      </MapView>
      {<PinPokemonModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addMarkerContainer: {
    flex: 1,
    width: 200,
    height: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
