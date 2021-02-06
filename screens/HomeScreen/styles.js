import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("screen");
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height;
const VISIBLE_ITEMS = 3;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    height,
    justifyContent: "center",
    // alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 2,
  },
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden",
  },
});
