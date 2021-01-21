import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 80,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    color: "#424242",
    borderRadius: 5,
    borderColor: "#424242",
    borderWidth: 1,
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
    position: "relative",
  },
  infoSections: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
    paddingHorizontal: 10,
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
  quantitySelectorContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "flex-start",
  },
  quantitySelectorButtons: {
    marginLeft: 10,
  },
  quantitySelectorButton: {
    height: 16,
    width: 16,
    marginVertical: 3,
    borderRadius: 2,
  },
});
