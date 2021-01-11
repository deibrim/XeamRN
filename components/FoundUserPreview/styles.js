import { Dimensions, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
  },
  userContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  lefContainer: {
    flexDirection: "row",
    width: "100%",
  },
  midContainer: {
    width: Dimensions.get("screen").width - 140,
    justifyContent: "center",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  highlight: {
    fontSize: 14,
    color: "grey",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
    borderRadius: 25,
    marginVertical: 2,
  },
  btn: {
    height: 25,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
});
