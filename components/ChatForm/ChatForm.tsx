import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import firebase from "../firebase/firebase.utils";

export class ChatForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    storageRef: firebase.storage().ref(),
    messagesRef: firebase.database().ref("messages"),
  };

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.currentUser.id,
        name: this.props.currentUser.name,
        avatar: this.props.currentUser.profile_pic
          ? this.props.currentUser.profile_pic
          : "",
      },
    };

    message["content"] = this.state.message;

    return message;
  };

  sendMessage = (e) => {
    const { createMessage } = this;
    const { message, messagesRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(this.props.currentChannel)
        .push()
        .set(createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((err) => {
          let errors = this.state.errors.concat(err);
          this.setState({ loading: false, errors });
        });
    } else {
      let errors = this.state.errors.concat({ message: "Add a message" });
      this.setState({ errors });
    }
  };

  render() {
    const { errors, message, loading } = this.state;
    const { handleChange, sendMessage } = this;

    return (
      <View style={styles.message__form}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Write your message..."
          placeholderTextColor="#000000"
          autoCapitalize="none"
          onChangeText={(e) => this.setState({ message: e })}
          value={message}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{ ...styles.appButtonContainer }}
        >
          {!loading && <Text style={{ ...styles.appButtonText }}>Send</Text>}
          {loading && (
            <Image
              style={{ marginLeft: 5, width: 20, height: 20 }}
              source={require("../assets/loader.gif")}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  message__form: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  input: {
    width: "80%",
    // margin: 15,
    paddingLeft: 6,
    height: 40,
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
  },
  appButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    elevation: 8,
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: 45,
    height: 45,
  },
  appButtonText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
const mapPropsToProps = (state) => ({
  currentChannel: state.chat.currentChannel,
  currentUser: state.user.currentUser,
});
export default connect(mapPropsToProps)(ChatForm);
