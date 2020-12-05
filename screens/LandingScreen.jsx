import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton/AppButton";

const LandingScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/images/landing5.png")}
          style={{ height: 400 }}
        />
      </View>
      <View style={styles.btns}>
        <AppButton
          onPress={() => {
            props.navigation.navigate("Register");
          }}
          title="GET STARTED"
          customStyle={styles.btn}
        />
        {/* <AppButton
          onPress={() => {
            props.navigation.navigate("Login");
          }}
          title="LOGIN"
          customStyle={{ ...styles.btn, ...styles.login }}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },

  btns: {
    marginTop: "auto",
    marginBottom: 50,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    // backgroundColor: "#000000",
    padding: 20,
    height: 50,
    borderRadius: 30,
    marginBottom: 20,
    width: "90%",
  },
  login: {
    height: 50,
    width: "80%",
  },
});

export default LandingScreen;