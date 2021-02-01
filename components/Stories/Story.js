import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Video } from "expo-av";
import PropTypes from "prop-types";

const ScreenWidth = Dimensions.get("window").width;

const Story = (props) => {
  const { story } = props;
  const { uri, type, resizeMode } = story || {};

  return (
    <View style={styles.container}>
      {type === "photo" ? (
        <Image
          source={{ uri }}
          onLoadEnd={props.onImageLoaded}
          style={styles.content}
          resizeMode={resizeMode}
        />
      ) : (
        <Video
          source={{ uri }}
          paused={props.pause || props.isNewStory}
          onError={(e) => console.log(e)}
          onLoad={(item) => props.onVideoLoaded(item)}
          style={styles.content}
          resizeMode={resizeMode}
          shouldPlay={!props.pause}
        />
      )}
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { width: "100%", height: "100%", flex: 1 },
  imageContent: {
    width: "100%",
    height: Dimensions.get("screen").height,
    flex: 1,
  },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Story;
