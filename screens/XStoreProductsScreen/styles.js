import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 0,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  saveText: {
    fontSize: 18,
  },
  btn: {
    height: 25,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "700",
    color: "#444444",
    paddingLeft: 10,
  },
  newProductSection: {
    marginTop: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 15,
    backgroundColor: "transparent",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
  },
  moreModalContainer: {
    position: "absolute",
    zIndex: 99999999,
    top: 0,
    right: 0,
    left: 0,
    alignItems: "flex-end",
    backgroundColor: "transparent",
    paddingTop: 55,
  },
  modalContainer: {
    alignItems: "center",
    minHeight: 20,
    minWidth: 150,
    maxWidth: 150,
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "pink",
    elevation: 4,
  },
  modalTextButton: {
    flexDirection: "row",
    marginVertical: 3,
    paddingVertical: 5,
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 14,
  },
});