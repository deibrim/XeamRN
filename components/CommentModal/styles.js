import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  commentModal: {
    height: "50%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ffffff",
    // zIndex: 99999,
  },
  commentHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  commentBox: {
    marginTop: "auto",
    marginBottom: 10,
  },
});
