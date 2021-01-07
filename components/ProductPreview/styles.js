import { Dimensions, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  productCard: {
    width: Dimensions.get("screen").width / 2.1,
    height: 240,
    position: "relative",
    marginVertical: 6,
    marginRight: 10,
  },
  productCardImage: {
    width: "100%",
    height: 240,
    borderRadius: 10,
  },
  productCardFooter: {
    minHeight: 50,
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
    bottom: 12,
  },
  productCardFooterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
    marginLeft: 3,
  },
  overlay: {
    borderRadius: 10,
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    // opacity: 0.5,
    backgroundColor: "#00000025",
    width: "100%",
  },
});
