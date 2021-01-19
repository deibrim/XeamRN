import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ecf2fa",
    marginTop: 40,
  },
  container: {
    width: Dimensions.get("screen").width - 20,
    height: 200,
    position: "relative",
    paddingHorizontal: 8,
    padding: 10,
  },
  innerContainer: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    flex: 1,
    width: "100%",
    // height: '100%'
  },
  logoContainer: {
    borderRadius: 30,
    borderColor: "#006eff",
    borderWidth: 4,
    elevation: 4,
    backgroundColor: "#ffffff",
    width: 100,
    height: 100,
    marginTop: -30,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  handle: {
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: "700",
    textAlign: "center",
  },
  count: {
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "500",
    textAlign: "center",
  },
});
