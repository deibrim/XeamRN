import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import firebase, { auth } from "../../firebase/firebase.utils";
import AppButton from "../AppButton/AppButton";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { styles } from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const ChangePasswordContainer = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggleShowCurrentPassword, setToggleShowCurrentPassword] = useState(
    false
  );
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [toggleShowConfirmPassword, setToggleShowConfirmPassword] = useState(
    false
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const onTitlePress = () => {
    setErrorMessage("");
    setVisible(!visible);
  };
  const onChangePassword = async () => {
    if (
      currentPassword.trim() === "" ||
      confirmPassword.trim() === "" ||
      password.trim() === ""
    ) {
      setErrorMessage("All fields are required");
      return;
    }
    if (confirmPassword !== password) {
      setErrorMessage("Password doesn't match");
      return;
    }
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    const currentUserAuth = auth.currentUser;
    try {
      const reAuth = await currentUserAuth.reauthenticateWithCredential(
        credential
      );
      if (reAuth.user) {
        currentUserAuth
          .updatePassword(password)
          .then(function () {
            setCurrentPassword("");
            setPassword("");
            setConfirmPassword("");
            setSuccessMessage("Password changed");
            setLoading(false);
            onTitlePress();
            wait(2000).then(async () => {
              setSuccessMessage("");
            });
          })
          .catch(function (error) {
            setErrorMessage("Something went wrong");
            console.log(result);
            setLoading(false);
          });
      }
    } catch (err) {
      setErrorMessage("Current password is incorrect");
      setErrorMessage(err.message);
      setLoading(false);
      return;
    }
  };
  return (
    <>
      {successMessage !== "" ? (
        <CustomPopUp
          message={`${successMessage}`}
          type={"success"}
          customStyles={{
            ...styles.customErrorStyle,
            backgroundColor: "green",
          }}
          customTextStyles={styles.customErrorTextStyles}
        />
      ) : null}
      <View style={styles.deleteContainer}>
        <View style={[styles.box, styles.theCompany]}>
          <TouchableWithoutFeedback onPress={onTitlePress}>
            <View style={styles.boxHead}>
              <Text style={styles.boxTitle}>Change Password</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
                style={{
                  transform: [
                    {
                      rotate: visible ? "180deg" : "0deg",
                    },
                  ],
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {visible ? (
            <View style={styles.deleteContainerContent}>
              {errorMessage !== "" ? (
                <CustomPopUp
                  message={`${errorMessage}`}
                  type={"error"}
                  customStyles={styles.customErrorStyle}
                  customTextStyles={styles.customErrorTextStyles}
                />
              ) : null}

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
                  secureTextEntry={!toggleShowCurrentPassword ? true : false}
                  placeholder="Current password"
                  placeholderTextColor="#000000"
                  autoCapitalize="none"
                  onChangeText={(e) => {
                    setErrorMessage("");
                    setCurrentPassword(e);
                  }}
                  value={currentPassword}
                />
                <TouchableWithoutFeedback
                  onPress={() =>
                    setToggleShowCurrentPassword(!toggleShowCurrentPassword)
                  }
                >
                  <Feather
                    name={toggleShowCurrentPassword ? "eye-off" : "eye"}
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
                  secureTextEntry={!toggleShowPassword ? true : false}
                  placeholder="New password"
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
                  placeholder="Confirm new password"
                  placeholderTextColor="#000000"
                  autoCapitalize="none"
                  onChangeText={(e) => {
                    setErrorMessage("");
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
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 10,
                }}
              >
                <AppButton
                  onPress={onChangePassword}
                  title={"Change Password"}
                  customStyle={{
                    width: "50%",
                  }}
                  textStyle={{
                    fontSize: 12,
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default ChangePasswordContainer;
