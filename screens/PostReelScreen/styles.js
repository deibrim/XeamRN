import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("screen").height,
    backgroundColor: "#006eff",
  },
  uiContainer: {
    flex: 1,
    height: Dimensions.get("screen").height,
    justifyContent: "space-between",
  },
  topContainer: {
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
    marginTop: "auto",
    marginBottom: 10,
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
    paddingLeft: 15,
    borderRadius: 30,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    width: 80,
  },
  buttonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
  },
});

export default styles;
