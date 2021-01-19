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
  sectionTitle: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "700",
    color: "#444444",
    paddingLeft: 10,
  },
  section: {
    marginTop: 10,
  },
  recentSection: { marginVertical: 20, paddingHorizontal: 0 },
  listReels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
});
