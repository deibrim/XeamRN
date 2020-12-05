import React from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Header = ({
  props,
  back,
  more,
  menu,
  user,
  title,
  iconColor,
  currentUser,
  customHeaderStyle,
  toggleShowMore,
  showMore,
}) => {
  return (
    <View style={{ ...styles.header, ...customHeaderStyle }}>
      {menu && (
        <TouchableOpacity onPress={() => {}} style={styles.appButtonContainer}>
          <MaterialIcons name={"short-text"} size={40} color={"#000000"} />
        </TouchableOpacity>
      )}
      {back && (
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={styles.appButtonContainer}
        >
          <MaterialIcons name={"chevron-left"} size={40} color={iconColor} />
        </TouchableOpacity>
      )}
      {title && (
        <Text style={{ fontSize: 20, lineHeight: 50, fontWeight: "bold" }}>
          {title}
        </Text>
      )}
      <View
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {more && (
          <TouchableOpacity
            onPress={() => {
              toggleShowMore(!showMore);
            }}
          >
            <MaterialIcons name={"more-vert"} size={30} color={iconColor} />
          </TouchableOpacity>
        )}
        {user && (
          <Image
            style={{ height: 30, width: 30, borderRadius: 5 }}
            source={
              currentUser && currentUser.profile_pic
                ? { uri: currentUser.profile_pic }
                : {
                    uri: `https://user-images.githubusercontent.com/1927295/68068778-fed0c900-fd69-11e9-95c1-29dd8e8134af.png`,
                  }
            }
          />
        )}
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
    // paddingBottom: 10,
    paddingHorizontal: 20,
    minHeight: 80,
    backgroundColor: "#ffffff",
  },
  appButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // elevation: 8,
    // backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonIcon: {
    marginRight: 10,
  },
});
