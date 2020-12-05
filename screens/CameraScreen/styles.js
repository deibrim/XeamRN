import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  recordControl: {
    position: "absolute",
    width: "100%",
    bottom: 60,
    flexDirection: "row",
    justifyContent: "center",
  },
  // recordControlBorder: {
  //   alignSelf: "center",
  //   height: 50,
  //   width: 50,
  //   borderRadius: 25,
  //   borderWidth: 2,
  //   borderColor: "#ffffff",
  // },
  buttonRecord: {
    alignSelf: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#ff4343",
  },
  buttonStop: {
    alignSelf: "center",
    marginVertical: 20,
    height: 30,
    width: 30,
    borderRadius: 3,
    backgroundColor: "#ff4343",
  },
  otherControl: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectFromPhone: {
    height: 30,
    width: 30,
    borderColor: "#006aff",
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCamera: {
    // alignSelf: "flex-end",
    // alignItems: "center",
  },
});

export default styles;
