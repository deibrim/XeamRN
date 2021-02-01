import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const DefaultTopNavigator = ({
  selected,
  backFunction,
  onFinish,
  loading,
}) => (
  <View
    style={{
      width: "98%",
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 5,
      backgroundColor: "#ecf2fa",
      borderRadius: 20,
    }}
  >
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 20,
        elevation: 2,
        backgroundColor: "red",
      }}
      onPress={backFunction}
    >
      <AntDesign name="close" size={20} color="#ffffff" />
    </TouchableOpacity>
    {loading && (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="black" />
      </View>
    )}
    <TouchableOpacity onPress={selected > 0 && onFinish}>
      <View
        style={[styles.button, selected > 0 && { backgroundColor: "#006eff" }]}
      >
        <Text style={[styles.buttonText, selected > 0 && { color: "#ffffff" }]}>
          {selected} Next
        </Text>
        <Ionicons
          name="ios-arrow-forward"
          size={15}
          color={selected > 0 ? "#ffffff" : "black"}
        />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    borderRadius: 20,
    width: 80,
  },
  buttonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
  },
});
