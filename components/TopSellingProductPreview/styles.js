import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
  },
  productCard: {
    width: Dimensions.get("screen").width,
    height: 230,
    position: "relative",
    paddingHorizontal: 8,
  },
  productCardImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
  },
  productCardFooter: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    // minHeight: 50,
    left: 9,
  },
  productCardFooterText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    // textShadow: "1 1 1 rgba(0, 0, 0, 0.4)",
  },
});
