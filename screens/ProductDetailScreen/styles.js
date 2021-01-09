import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    height: 50,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    color: "#424242",
    borderRadius: 25,
  },
  infoText: {
    fontSize: 18,
    color: "#555555",
    marginLeft: 0,
    marginBottom: 10,
  },
  sizeBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#ecf2fa",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    position: "relative",
    marginVertical: 5,
  },
  infoSections: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
  },
});
