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
  topContainer: {
    position: "absolute",
    top: 10,
    width: "100%",
    marginTop: 30,
    alignSelf: "flex-start",
    height: 40,
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 5,
  },
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
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
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
    // flex: 1,
    width: "100%",
    textAlign: "center",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    color: "#424242",
    borderRadius: 25,
    letterSpacing: 1,
    margin: 0,
  },
  fontSizeSliderWrapper: {
    height: 20,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 150,
  },
  textColorPickerWrapper: {
    // position: "absolute",
    // top: "16%",
    // left: 5,
  },
  backgroundColorPickerWrapper: {
    position: "absolute",
    bottom: "16%",
    left: 5,
  },
});
