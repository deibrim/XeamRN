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
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
  inputGroup: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    marginHorizontal: 0,
    // borderRadius: ,
  },
  inputGroupIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    borderRadius: 25,
  },
  btns: {
    alignItems: "center",
    marginTop: 30,
  },
  btn: {
    padding: 20,
    width: "70%",
  },
});
