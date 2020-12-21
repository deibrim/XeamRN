import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  container: {
    // flex: 1,
    height: "100%",
    width: "100%",
    paddingVertical: 30,
    backgroundColor: "#ecf2fa",
  },
  textInput: {
    borderRadius: 20,
    margin: 10,
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 15,
  },
  textInputContainer: {
    alignSelf: "flex-end",
    height: 80,
    padding: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    paddingLeft: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    // zIndex: 99,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    width: 80,
  },
  buttonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
  },
});
