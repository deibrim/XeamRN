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
  customDialogBody: {
    flex: 1,
  },
  modalTextButton: {
    marginVertical: 3,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff0000",
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 15,
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
