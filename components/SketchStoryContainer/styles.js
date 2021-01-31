import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("screen");
export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    flex: 1,
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
  controls: {
    position: "absolute",
    right: 20,
    top: "20%",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "#006eff89",
    borderRadius: 50,
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    // flex: 0.5,
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
