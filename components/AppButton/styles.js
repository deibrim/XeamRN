import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  appButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonIcon: {
    marginRight: 10,
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});

export default styles;
