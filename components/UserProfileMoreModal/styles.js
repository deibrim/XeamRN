import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    minHeight: 30,
    minWidth: 150,
    maxWidth: 150,
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  modalTextButton: {
    marginVertical: 3,
    paddingVertical: 10,
    borderBottomColor: "#999999",
    borderBottomWidth: 0.5,
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 16,
  },
});
