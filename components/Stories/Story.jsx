import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Video } from "expo-av";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { deleteUserStory, updateViews } from "../../firebase/firebase.utils";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import HelperDialog from "../HelperDialog/HelperDialog";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Story = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const {
    story,
    userId,
    isLoaded,
    setTimestamp,
    setViewCount,
    onPause,
    nextStory,
  } = props;
  const { id, uri, type, resizeMode, views, duration, postedAt } = story || {};
  const [dialogVisible, setDialogVisible] = useState(false);
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
      {dialogVisible ? (
        // <
        // >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            onPause(false);
            setDialogVisible(false);
          }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            backgroundColor: "#ffffff34",
          }}
        >
          <View
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: "#ffffff",
              width: "90%",
              borderRadius: 10,
              elevation: 4,
            }}
          >
            <View style={{ minHeight: 100 }}>
              <View style={styles.customDialogTitle}>
                <Text
                  style={[
                    styles.username,
                    { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                  ]}
                >
                  Are you sure you want to delete?
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.modalTextButton]}
                onPress={() => {
                  onDeleteStory();
                  onPause(false);
                  setDialogVisible(false);
                  nextStory();
                }}
              >
                <FontAwesome5
                  name="trash-alt"
                  size={20}
                  color="red"
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.modalText, { color: "red" }]}>
                  Confirm delete story
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ) : // </>
      null}

      {currentUser.id === userId && isLoaded && (
        <View style={styles.rightUiControls}>
          <View style={[styles.btn, styles.viewButton]} onPress={() => {}}>
            <MaterialIcons name="visibility" size={18} color="#111111" />
            <Text style={{ marginLeft: 5 }}>{getViewCount()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.deleteStoryButton]}
            onPress={() => {
              onPause(true);
              setDialogVisible(true);
            }}
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
    bottom: "6.5%",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingRight: 5,
    paddingHorizontal: 5,
  },
  username: {
    color: "#42414C",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: -2,
    letterSpacing: 1,
  },
  customDialogTitle: {
    paddingVertical: 5,
    borderBottomColor: "#44444444",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10,
  },
  modalTextButton: {
    marginVertical: 3,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Story;
