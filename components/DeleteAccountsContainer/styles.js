import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  deleteContainer: {},
  box: { marginBottom: 10 },
  theCompany: {},
  boxHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecf2fa",
    elevation: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  deleteContainerContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "red",
    textTransform: "uppercase",
  },
  deleteBtn: {
    marginVertical: 10,
  },
  deleteBtnText: {
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: "600",
    color: "#ff000096",
  },
});
