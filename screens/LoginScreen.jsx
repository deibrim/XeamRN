import React, { useState } from "react";
import { AntDesign, EvilIcons, Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { auth } from "../firebase/firebase.utils";
import AppButton from "../components/AppButton/AppButton";
import CustomPopUp from "../components/CustomPopUp/CustomPopUp";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event) => {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      error.code === "auth/wrong-password"
        ? setErrorMessage(
            "The password is invalid or the user does not have a password."
          )
        : error.code === "auth/user-not-found"
        ? setErrorMessage(
            "There is no user record corresponding to this identifier."
          )
        : setErrorMessage("Shit just got real");
      setLoading(false);
    }
    // this.setState({ email: '', password: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headText}>WELCOME BACK</Text>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        {errorMessage !== "" ? (
          <CustomPopUp
            message={`${errorMessage}`}
            type={"error"}
            customStyles={{ backgroundColor: "red" }}
            customTextStyles={{ color: "#ffffff" }}
          />
        ) : null}
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
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => {
            setErrorMessage("");
            setEmail(e);
          }}
          value={email}
        />
      </View>
      <View style={styles.inputGroup}>
        <AntDesign
          style={styles.inputGroupIcon}
          name="lock"
          size={22}
          color="black"
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          secureTextEntry={!toggleShowPassword ? true : false}
          placeholder="Password"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => {
            setErrorMessage("");
            setPassword(e);
          }}
          value={password}
        />
        <TouchableWithoutFeedback
          onPress={() => setToggleShowPassword(!toggleShowPassword)}
        >
          <Feather
            name={toggleShowPassword ? "eye-off" : "eye"}
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginVertical: 15 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate("Reset");
          }}
        >
          <Text style={{ textAlign: "center", color: "#006aff" }}>
            Forgot password?
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.btns}>
        <AppButton
          onPress={handleSubmit}
          title="LOGIN"
          customStyle={styles.btn}
          loading={loading}
        />
      </View>
      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <Text style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          >
            <Text style={{ color: "#006aff" }}>Register</Text>
          </TouchableWithoutFeedback>
        </Text>
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

export default LoginScreen;
