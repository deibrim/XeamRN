import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";

class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;

    return (
      <View style={styles.userView}>
        <Image source={{ uri: props.profile }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.time}>{moment(props.timestamp).fromNow()}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginLeft: 8,
  },
  userView: {
    flexDirection: "row",
    position: "absolute",
    top: 55,
    width: "98%",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
    color: "white",
  },
  time: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 3,
    marginLeft: 12,
    color: "white",
  },
});

export default UserView;
