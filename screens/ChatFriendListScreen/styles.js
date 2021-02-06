import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    // fontWeight: "bold",
  },
  chatCountContainer: {
    width: 60,
    backgroundColor: "#b3b4b6",
    padding: 5,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  chatCount: {
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
