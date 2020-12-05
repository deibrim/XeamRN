import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  reelCardContainer: {
    width: "100%",
    height: 230,
    flexDirection: "row",
    alignItems: "center",
  },
  reelCard: {
    width: 300,
    height: 230,
    position: "relative",
    marginRight: 8,
  },
  userAddReel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },
  reelCardImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
  },
  reelCardFooter: {
    width: "100%",
    position: "absolute",
    bottom: 12,
    left: 9,
  },
  reelCardFooterText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    // textShadow: "1 1 1 rgba(0, 0, 0, 0.4)",
  },
});
