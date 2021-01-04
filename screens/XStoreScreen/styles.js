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
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    elevation: 4,
  },
  userPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#42414C",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 1,
  },
  listReels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  btn: {
    height: 35,
  },
  section: {
    marginVertical: 20,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sectionTitle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 5,
    color: "#444444",
    fontWeight: "bold",
  },
});
