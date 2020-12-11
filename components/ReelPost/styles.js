import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
  },
  videPlayButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  uiContainer: {
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  bottomContainer: {
    width: "90%",
    padding: 10,
    paddingHorizontal: 25,
    marginBottom: 20,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  handle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 10,
    marginRight: 10,
  },
  description: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "300",
    marginBottom: 8,
  },
  songRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  songName: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },

  songImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "#4c4c4c",
  },

  //  right container
  rightContainer: {
    position: "absolute",
    right: 0,
    top: "40%",
    alignSelf: "flex-end",
    height: "25%",
    justifyContent: "flex-start",
    marginRight: 0,
  },
  centerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#000000",
    // opacity: 0.5,
    zIndex: 1,
  },
  rightContainerBg: {
    position: "absolute",
    right: 0,
    // top: "40%",
    alignSelf: "center",
    height: "100%",
    justifyContent: "center",
    borderRadius: 30,
    marginRight: 5,
    backgroundColor: "#000000",
    opacity: 0.7,
    padding: 12,
    zIndex: 9,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },

  iconContainer: {
    alignItems: "center",
    // margin: 10,
    marginVertical: 6,
  },
  statsLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default styles;
