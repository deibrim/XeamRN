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
    borderRadius: 26,
  },
  rounded: {
    borderRadius: 30,
    marginVertical: 5,
    width: 70,
    height: 70,
    borderWidth: 2,
    padding: 2,
    borderColor: "#006eff",
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    color: "#11111198",
  },
});
