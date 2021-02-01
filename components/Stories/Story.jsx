import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Video } from "expo-av";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { deleteUserStory, updateViews } from "../../firebase/firebase.utils";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Story = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { story, userId, isLoaded, setTimestamp, setViewCount } = props;
  const { id, uri, type, resizeMode, views, duration, postedAt } = story || {};
  function getViewCount() {
    return Object.values(views).filter((v) => v).length;
  }
  useEffect(() => {
    setTimestamp(postedAt);
    setViewCount(getViewCount());
  }, []);
  const onView = useCallback(() => {
    // const viewCount = getViewCount();
    wait(2000).then(() => {
      const currentUserId = currentUser.id;
      const isViewed = views[currentUserId] === true;
      if (isViewed) {
        return;
      } else if (!isViewed) {
        let views = story.views;
        views[currentUserId] = true;
        story.views = views;
        // console.log(story);
        //  updateViews(story, userId, id)
      }
    });
  }, []);
  const onDeleteStory = () => {
    deleteUserStory(userId, id);
  };
  return (
    <>
      <View style={styles.container}>
        {type === "photo" ? (
          <Image
            source={{ uri }}
            onLoadEnd={() => {
              props.onImageLoaded(duration);
              onView();
            }}
            style={styles.content}
            resizeMode={resizeMode}
          />
        ) : (
          <Video
            source={{ uri }}
            paused={props.pause || props.isNewStory}
            onError={(e) => console.log(e)}
            onLoad={(item) => {
              props.onVideoLoaded(item);
              onView();
            }}
            style={styles.content}
            resizeMode={resizeMode}
            shouldPlay={!props.pause}
          />
        )}
      </View>
      {currentUser.id === userId && isLoaded && (
        <View style={styles.rightUiControls}>
          <View style={[styles.btn, styles.viewButton]} onPress={() => {}}>
            <MaterialIcons name="visibility" size={18} color="#111111" />
            <Text style={{ marginLeft: 5 }}>{getViewCount()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.deleteStoryButton]}
            onPress={() => onDeleteStory()}
          >
            <FontAwesome5 name="trash-alt" size={20} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </>
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
  rightUiControls: {
    position: "absolute",
    top: "6.5%",
    flexDirection: "row",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
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
  btn: {
    margin: 5,
    backgroundColor: "#ffffff",
    elevation: 3,
    borderRadius: 30,
  },
  deleteStoryButton: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButton: {
    // height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingRight: 5,
    paddingHorizontal: 5,
  },
});

export default Story;
