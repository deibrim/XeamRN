import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("screen");
export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    // zIndex: 4,
    flex: 1,
    // height,
    width: "100%",
    backgroundColor: "#00000000",
  },
  container: {
    flex: 1,
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    // backgroundColor: "#fff",
    color: "#424242",
    borderRadius: 25,
    letterSpacing: 1,
  },
});
