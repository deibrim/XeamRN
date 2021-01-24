import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 20,
  },
  headText: {
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#11111199",
    marginBottom: 5,
  },
  step: {
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: "600",
  },
});
