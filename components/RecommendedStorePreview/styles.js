import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ecf2fa",
    marginTop: 40,
  },
  container: {
    width: Dimensions.get("screen").width / 2,
    height: 230,
    position: "relative",
    paddingHorizontal: 8,
    padding: 10,
    borderRadius: 20,
  },
  background: {
    flex: 1,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000094",
    borderRadius: 20,
  },
  innerContainer: {
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  logoContainer: {
    borderRadius: 40,
    borderColor: "#006eff",
    borderWidth: 2,
    elevation: 4,
    backgroundColor: "#ffffff",
    width: 70,
    height: 70,
    marginTop: -40,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  handle: {
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    marginVertical: 10,
    marginTop: 20,
  },
  count: {
    color: "#ffffff",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
    fontWeight: "500",
    textAlign: "center",
  },
});
