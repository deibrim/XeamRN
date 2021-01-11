import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    elevation: 4,
  },
  userPreview: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingRight: 50,
  },
  title: {
    color: "#42414C",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 1,
  },
  centerContainer: {
    position: "absolute",
    top: 90,
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
  listReels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  moreModalContainer: {
    position: "absolute",
    zIndex: 5,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "flex-end",
    backgroundColor: "transparent",
    paddingTop: 85,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "transparent",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
