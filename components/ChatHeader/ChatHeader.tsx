import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
export class ChatHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      searchTerm,
    } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.message}>
          <Text style={{ ...styles.name_count }}>{channelName}</Text>
          <Text style={{ ...styles.name_count, fontSize: 14 }}>
            {numUniqueUsers}
          </Text>
        </View>
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Search Messages..."
            placeholderTextColor="#000000"
            autoCapitalize="none"
            onChangeText={handleSearchChange}
            value={searchTerm}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  message: {
    width: "60%",
  },
  message__other__view: {},
  name_count: {
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    paddingLeft: 6,
    height: 35,
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
  },
});
export default ChatHeader;
