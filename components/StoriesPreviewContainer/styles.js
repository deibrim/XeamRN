import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  storyPreviewContainer: { marginVertical: 2, marginRight: 10, paddingTop: 10 },
  storyPreviewImageContainer: {
    elevation: 4,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    padding: 1,
  },
  storyPreviewImage: {
    height: 60,
    width: 60,
    borderRadius: 18,
  },
  storyPreviewText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
});
