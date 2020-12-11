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
  centerContainer: {
    // position: "absolute",
    // top: 0,
    // bottom: 0,
    // right: 0,
    // left: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    // opacity: 0.5,
    zIndex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ecf2fa",
  },
  textInput: {
    borderRadius: 20,
    margin: 10,
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 15,
  },
  button: {
    borderRadius: 30,
    backgroundColor: "#ff4747",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    height: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
