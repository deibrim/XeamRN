import { StyleSheet } from "react-native";
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
    paddingHorizontal: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    fontSize: 16,
  },
  imageContainer: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#006aff",
  },
  profilePic: {
    width: 28,
    height: 28,
    borderRadius: 15,
  },
  userContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  lefContainer: {
    flexDirection: "row",
    width: "100%",
  },
  midContainer: {
    justifyContent: "center",
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
  highlight: {
    fontSize: 14,
    color: "grey",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
    borderRadius: 25,
    marginVertical: 2,
  },
  btn: {
    height: 25,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
});
