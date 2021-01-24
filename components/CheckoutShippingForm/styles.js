import { Dimensions, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 20,
  },
  headText: {
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#11111199",
    marginBottom: 5,
  },
  step: {
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: "600",
  },
  inputGroupWrapper: {
    marginBottom: 40,
    flex: 1,
    // maxHeight: 60,
    width: Dimensions.get("window").width,
  },
  label: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#11111167",
    paddingLeft: 40,
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginLeft: 10,
  },
  inputGroupIcon: {
    paddingTop: 5,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 30,
    borderBottomColor: "#111111",
    borderBottomWidth: 1,
    color: "#424242",
    borderRadius: 25,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    // justifyContent: "space-between",
    paddingRight: 10,
  },
  checkboxWrapper: {
    paddingHorizontal: 10,
    margin: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxText: {
    fontSize: 14,
    color: "#11111189",
    letterSpacing: 1,
  },
  btnWrapper: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    borderRadius: 5,
    width: "80%",
  },
  btnTxt: {
    fontSize: 14,
  },
});
