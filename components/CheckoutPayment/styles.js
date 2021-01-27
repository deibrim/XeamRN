import { StyleSheet } from "react-native";
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
    // marginBottom: 20,
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
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
    flex: 1,
    width: "100%",
  },
  checkboxWrapper: {
    paddingHorizontal: 20,
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
