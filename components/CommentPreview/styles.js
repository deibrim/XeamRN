import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  lefContainer: {
    flexDirection: "row",
    width: "100%",
  },
  midContainer: {
    justifyContent: "center",
  },
  photo: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: "black",
    flex: 1,
    // flexWrap: "wrap",
    // width: "100%",
    marginBottom: 20,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    elevation: 1,
    marginBottom: 20,
    // borderBottomColor: "gray",
    // borderBottomWidth: 0.5,
    // borderTopWidth: 0.5,
  },
  repliesText: {
    fontWeight: "bold",
    // fontSize: 14,
    color: "#555555",
    fontSize: 15,
  },
});
