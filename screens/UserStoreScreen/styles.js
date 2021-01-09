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
    // paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 60,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    // elevation: 4,
  },
  imageContainer: {
    borderRadius: 25,
    marginBottom: 5,
    // borderWidth: 2,
    // borderColor: "#006aff",
    elevation: 2,
  },
  profilePic: {
    width: 28,
    height: 28,
    borderRadius: 15,
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
});
