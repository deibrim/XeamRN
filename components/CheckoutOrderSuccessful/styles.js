import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  username: {
    color: "#42414C",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: -2,
    letterSpacing: 1,
  },
  customDialogTitle: {
    paddingVertical: 5,
    borderBottomColor: "#44444444",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  stongText: {
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 20,
  },
  normalText: {
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
  },
  hintText: {
    fontSize: 12,
    letterSpacing: 1,
    textAlign: "center",
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
