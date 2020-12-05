import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
const EditProfileInputGroup = ({ label, value, handleChange }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={{ fontSize: 15, color: "gray", width: 70, marginTop: 5 }}>
        {label}:
      </Text>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder={label}
        placeholderTextColor="#000000"
        onChangeText={(e) => {
          handleChange(e);
        }}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    marginVertical: 5,
  },
  input: {
    flex: 1,
    margin: 15,
    paddingLeft: 6,
    height: 40,
    borderBottomColor: "#b3b4b6",
    borderBottomWidth: 1,
  },
});

export default EditProfileInputGroup;
