import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    elevation: 1,
  },
  title: {
    color: "#111111",
    fontSize: 16,
    marginBottom: 1,
    marginLeft: 10,
  },
  path: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 50,
  },
  icon: {
    borderColor: "#006eff",
    borderWidth: 3,
    borderRadius: 20,
    padding: 5,
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: "#11111189",
  },
});
