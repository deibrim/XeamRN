import { StyleSheet } from "react-native";

const BAR_HEIGHT = StyleSheet.hairlineWidth * 5;

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
  progressBarContainer: {
    width: "90%",
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
    position: "absolute",
    top: -5,
  },

  progressBar: {
    height: "100%",
    width: "100%",
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: "red",
  },
  recordControlWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ff4343",
    backgroundColor: "transparent",
  },
  buttonRecord: {
    alignSelf: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#ff4343",
  },
  buttonStop: {
    height: 20,
    width: 20,
    borderRadius: 3,
    backgroundColor: "#ff4343",
  },
  otherControl: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    // flexDirection: "row",
    justifyContent: "center",
    // height: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  otherControlWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000096",
    borderRadius: 20,
  },
  selectFromPhone: {
    padding: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCamera: {
    backgroundColor: "#ffffff89",
    padding: 5,
    borderRadius: 25,
  },
  assets: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    minHeight: 80,
  },
});

export default styles;
