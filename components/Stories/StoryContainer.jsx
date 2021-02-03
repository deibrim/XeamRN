import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  LogBox,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import GestureRecognizer from "react-native-swipe-gestures";
import Story from "./Story";
import UserView from "./UserView";
import Readmore from "./StoryAction";
import ProgressArray from "./ProgressArray";
import ReplyStoryInput from "./ReplyStoryInput";
import StoryAction from "./StoryAction";

const SCREEN_WIDTH = Dimensions.get("window").width;

const StoryContainer = (props) => {
  const { user } = props;
  const { stories = [] } = user || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModelOpen, setModel] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const story = stories.length ? stories[currentIndex] : {};
  const [duration, setDuration] = useState(story.duration);
  const [timestamp, setTimestamp] = useState(story.postedAt);
  const [viewCount, setViewCount] = useState(
    Object.values(story.views).filter((v) => v).length
  );
  const { externalLink, uri } = story || {};

  const changeStory = (evt) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };
  useEffect(() => {
    LogBox.ignoreLogs([
      `Warning: Each child in a list should have a unique "key" prop.`,
    ]);
  }, [duration, timestamp, viewCount]);

  const nextStory = () => {
    if (stories.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
    } else {
      setCurrentIndex(0);
      props.onStoryNext();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0 && stories.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(story.duration);
    } else {
      setCurrentIndex(0);
      props.onStoryPrevious();
    }
  };
  const onImageLoaded = (duration) => {
    setLoaded(true);
    setDuration(duration);
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.durationMillis / 1000);
  };

  const onPause = (result) => {
    setIsPause(result);
  };

  const onReadMoreOpen = () => {
    setIsPause(true);
    setModel(true);
  };
  const onReadMoreClose = () => {
    setIsPause(false);
    setModel(false);
  };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View style={{ width: 1, height: 1 }}>
            <Story
              onImageLoaded={onImageLoaded}
              pause
              onPause={onPause}
              onVideoLoaded={onVideoLoaded}
              story={story}
              userId={user.userId}
              isLoaded={isLoaded}
              setTimestamp={setTimestamp}
              setViewCount={setViewCount}
              nextStory={nextStory}
            />
          </View>
          <ActivityIndicator color="white" />
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    if (!isModelOpen) {
      props.onClose();
    } else if (externalLink.trim() === "") {
      setShowReplyInput(false);
      onPause(false);
    } else {
      onPause(false);
      setModel(false);
    }
  };

  const onSwipeUp = () => {
    setIsPause(true);
    if (!isModelOpen && externalLink.trim() !== "") {
      setModel(true);
    } else {
      setShowReplyInput(true);
    }
  };

  return (
    <GestureRecognizer
      onSwipeDown={onSwipeDown}
      onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={500}
        onPress={(e) => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}
      >
        <View style={styles.container}>
          <Story
            onImageLoaded={onImageLoaded}
            pause={isPause}
            onPause={onPause}
            isNewStory={props.isNewStory}
            onVideoLoaded={onVideoLoaded}
            story={story}
            userId={user.userId}
            isLoaded={isLoaded}
            setTimestamp={setTimestamp}
            setViewCount={setViewCount}
            nextStory={nextStory}
          />

          {loading()}

          {!isPause && (
            <UserView
              name={user.username}
              profile={user.profile_pic}
              onClosePress={props.onClose}
              timestamp={timestamp}
            />
          )}

          {externalLink.trim() === "" ? (
            <StoryAction
              onPress={() => setShowReplyInput(true)}
              text={"Reply"}
            />
          ) : (
            <StoryAction onPress={onReadMoreOpen} text={"Swipe up"} />
          )}
          {showReplyInput && (
            <ReplyStoryInput
              setShowReplyInput={setShowReplyInput}
              setIsPause={setIsPause}
            />
          )}

          <ProgressArray
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewStory={props.isNewStory}
            stories={stories}
            currentIndex={currentIndex}
            currentStory={stories[currentIndex]}
            length={stories.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />
        </View>
        <Modal
          animationType="fade"
          statusBarTranslucent={true}
          transparent={true}
          visible={isModelOpen}
          onRequestClose={onReadMoreClose}
          style={styles.modal}
          position="bottom"
        >
          <View style={styles.bar} />
          <WebView source={{ uri: externalLink }} />
        </Modal>
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  progressBarArray: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    width: "98%",
    height: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userView: {
    flexDirection: "row",
    position: "absolute",
    top: 55,
    width: "98%",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
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
  content: { width: "100%", height: "100%" },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: Dimensions.get("screen").height,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  bar: {
    height: 20,
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 8,
  },
});

export default StoryContainer;
