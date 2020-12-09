import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    width: "90%",
    backgroundColor: "#2CD990",
  },
  containerErr: {
    backgroundColor: "#FE524D",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
