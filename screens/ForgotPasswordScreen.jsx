import React, { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, TextInput } from "react-native";
import AppButton from "../components/AppButton/AppButton";
import { auth } from "../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(email);
      navigation.navigate("Login");
    } catch (error) {
      error.code === "auth/invalid-email"
        ? setErrorMessage("The email address is badly formatted.")
        : error.code === "auth/user-not-found"
        ? setErrorMessage(
            "There is no user record corresponding to this identifier. The user may have been deleted."
          )
        : setErrorMessage("Internal server error");
    }
    // this.setState({ email: '', password: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headText}>RESET PASSWORD</Text>
      </View>
      <View style={styles.inputGroup}>
        <EvilIcons
          name="envelope"
          style={styles.inputGroupIcon}
          size={24}
          color="black"
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Email"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => {
            setEmail(e);
          }}
          value={email}
        />
      </View>

      <View style={styles.btns}>
        <AppButton
          onPress={handleSubmit}
          title="RESET PASSWORD"
          customStyle={styles.btn}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  head: {
    alignItems: "center",
    marginBottom: 20,
  },
  headText: {
    fontSize: 25,
  },
  inputGroup: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 25,
  },
  inputGroupIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    borderRadius: 25,
  },
  btns: {
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    padding: 20,
    width: "70%",
  },
});

export default ForgotPasswordScreen;
