import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingLeft: 10,
  },
  userContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 5,
  },
  roundedImage: {
    height: "100%",
    width: "100%",
    borderRadius: 16,
  },
  rounded: {
    borderRadius: 20,
    marginVertical: 5,
    width: 60,
    height: 60,
    borderWidth: 2,
    padding: 2,
    borderColor: "#006eff",
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#11111198",
  },
});
