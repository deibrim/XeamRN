import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import { LogBox } from "react-native";

const ProgressArray = (props) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // console.log(props.currentIndex);
    // console.log(props.currentStory);
    LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified."]);
    if (props.pause) {
      Animated.timing(opacity, {
        toValue: 0,
        timing: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        timing: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [props.pause]);
  const onView = useCallback(() => {
    const viewCount = getViewCount();
    wait(2000).then(() => {
      const isViewed = post.views[currentUser.id] === true;
      const currentUserId = currentUser.id;
      if (isViewed) {
        return;
      } else if (!isViewed) {
        post.views[currentUserId] = true;
        let views = post.views;
        firestore
          .collection("reels")
          .doc(post.user_id)
          .collection("userReels")
          .doc(post.id)
          .update({ viewCount, views });
      }
    });
  }, []);

  return (
    <Animated.View style={[styles.progressBarArray, { opacity }]}>
      {props.length.map((i, index) => (
        <ProgressBar
          key={index}
          index={index}
          duration={props.duration || 15}
          isNewStory={props.isNewStory}
          currentIndex={props.currentIndex}
          next={props.next}
          length={props.stories.length}
          active={i === props.currentIndex ? 1 : i < props.currentIndex ? 2 : 0}
          isLoaded={props.isLoaded}
          pause={props.pause}
          style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }], height: 0.5 }}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBarArray: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    width: "98%",
    height: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProgressArray;
