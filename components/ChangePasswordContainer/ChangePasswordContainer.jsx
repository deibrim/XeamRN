import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { styles } from "./styles";

const ChangePasswordContainer = () => {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const onTitlePress = () => {
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
    setLoading(false);
  };
  return (
    <>
      {errorMessage !== "" ? (
        <CustomPopUp
          message={`${errorMessage}`}
          type={"error"}
          customStyles={{ backgroundColor: "red" }}
          customTextStyles={{ color: "#ffffff" }}
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
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default ChangePasswordContainer;
