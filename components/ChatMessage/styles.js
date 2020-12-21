import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: "relative",
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
  },
  name: {
    color: Colors.light.tint,
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    color: "black",
  },
  time: {
    alignSelf: "flex-end",
    color: "grey",
    fontSize: 12,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 30,
    justifyContent: "center",
    // zIndex: 99,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    width: 22,
    borderRadius: 20,
  },
});

export default styles;
