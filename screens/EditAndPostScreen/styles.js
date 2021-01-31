import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  videPlayButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    position: "absolute",
    top: 0,
  },
  uiContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
  resizer: {
    position: "absolute",
    right: 15,
    bottom: "10%",
    zIndex: 2,
    backgroundColor: "#006eff89",
    elevation: 2,
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomContainer: {
    alignSelf: "flex-end",
    height: 80,
    padding: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainerFocused: {
    marginBottom: 300,
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    paddingLeft: 10,
    borderRadius: 20,
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
});

export default styles;
