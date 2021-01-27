import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    // top: 0,
    height: Dimensions.get("screen").height - 100,
    width: "100%",
    bottom: 0,
    zIndex: 2,
    paddingTop: 20,
    backgroundColor: "#ecf2fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
  },
  buttonStyle: {
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "black",
    width: 100,
  },
});
