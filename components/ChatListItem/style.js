import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  lefContainer: {
    flexDirection: "row",
  },
  midContainer: {
    justifyContent: "space-around",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 16,
    color: "grey",
  },
  time: {
    fontSize: 14,
    color: "grey",
  },
  isOnline: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "#0EE713",
    position: "absolute",
    top: 5,
    left: -5,
  },
  isOffline: {
    backgroundColor: "#42414C",
  },
});

export default styles;
