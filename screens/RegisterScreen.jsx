import React, { useEffect, useState } from "react";
import { AntDesign, EvilIcons, Feather, FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import {
  auth,
  createUserProfileDocument,
  firestore,
} from "../firebase/firebase.utils";
import AppButton from "../components/AppButton/AppButton";

const RegisterScreen = (props) => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [toggleShowConfirmPassword, setToggleShowConfirmPassword] = useState(
    false
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, []);
  const checkUsernameAndCreateAccount = async () => {
    const usersRef = await firestore
      .collection("users")
      .where("username", "==", `${username.toLowerCase()}`);
    const snapshot = await usersRef.get();
    if (snapshot.docs.length > 0) {
      setErrorMessage("Username already existed");
      setLoading(false);
      return;
    }
    createUser();
  };
  const handleRegisterUser = async () => {
    setLoading(true);
    checkUsernameAndCreateAccount();
  };
  const createUser = async () => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfileDocument(user, {
        username: username.toLowerCase(),
        name: fullname,
      });
      setLoading(false);
    } catch (error) {
      error.code === "auth/email-already-in-use"
        ? setErrorMessage(
            "The email address is already in use by another account"
          )
        : error.code === "auth/weak-password"
        ? setErrorMessage("Password should be at least 6 characters")
        : setErrorMessage("Internal server error");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headText}>CREATE ACCOUNT</Text>
      </View>

      <View style={styles.inputGroup}>
        <AntDesign
          style={styles.inputGroupIcon}
          name="user"
          size={20}
          color="black"
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Full name"
          placeholderTextColor="#000000"
          autoCapitalize="words"
          onChangeText={(e) => {
            setFullname(e);
          }}
          value={fullname}
        />
      </View>
      <View style={styles.inputGroup}>
        <FontAwesome
          style={styles.inputGroupIcon}
          name="at"
          size={18}
          color="black"
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Username"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => {
            setUsername(e);
          }}
          value={username}
        />
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
          keyboardType="email-address"
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
          secureTextEntry={!toggleShowConfirmPassword ? true : false}
          placeholder="Confirm password"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => {
            setConfirmPassword(e);
          }}
          value={confirmPassword}
        />
        <TouchableWithoutFeedback
          onPress={() =>
            setToggleShowConfirmPassword(!toggleShowConfirmPassword)
          }
        >
          <Feather
            name={toggleShowConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.btns}>
        <AppButton
          onPress={handleRegisterUser}
          title="REGISTER"
          customStyle={styles.btn}
          loading={loading}
        />
      </View>
      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <Text style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            <Text style={{ color: "#006aff" }}>Login</Text>
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
    marginTop: 30,
  },
  btn: {
    padding: 20,
    width: "70%",
  },
});

export default RegisterScreen;
