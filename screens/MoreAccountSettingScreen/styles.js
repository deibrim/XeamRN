import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    color: "#111111",
    fontSize: 18,
    marginBottom: 1,
  },

  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ecf2fa",
    paddingTop: 20,
  },

  copyright: {
    marginTop: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
});

export default styles;
