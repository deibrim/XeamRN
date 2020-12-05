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
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    color: "#42414C",
    fontSize: 18,
    marginBottom: 1,
  },
  section: {
    marginVertical: 20,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sectionTitle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 10,
    fontWeight: "bold",
    color: "gray",
  },
  wallpapers: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wallpaperPreview: {
    height: 130,
    width: "30%",
    borderRadius: 10,
    marginVertical: 5,
  },
  currentsWallpaper: {
    borderWidth: 2,
    borderColor: "#006eff",
  },
});
