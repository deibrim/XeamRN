import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import { LogBox } from "react-native";

const ProgressArray = (props) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const [currentStory, setCurrentStory] = useState({});
  const [flatListRef, setFlatListRef] = useState({});

  useEffect(() => {
    LogBox.ignoreLogs([
      "Animated: `useNativeDriver` was not specified.",
      `Warning: Each child in a list should have a unique "key" prop.`,
    ]);
    // console.log(props);
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
      }
    });
  }, []);
  const onViewRef = useRef(({ viewableItems, changed }) => {
    const data = {
      isViewable: viewableItems[0].isViewable,
      index: viewableItems[0].index,
    };
    setCurrentStory(data);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

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
          currentStory={currentStory}
          active={i === props.currentIndex ? 1 : i < props.currentIndex ? 2 : 0}
          isLoaded={props.isLoaded}
          pause={props.pause}
          style={{
            transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
            height: 0.5,
          }}
        />
      ))}
    </Animated.View>
  );
};

/*
 <FlatList
        data={props.stories}
        ref={(ref) => {
          // console.log("Length", props.stories);
          setFlatListRef(ref);
        }}
        horizontal
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ i, index }) => {
          console.log(i);
          return (
            <ProgressBar
              key={index}
              index={index}
              duration={props.duration || 15}
              isNewStory={props.isNewStory}
              currentIndex={props.currentIndex}
              next={props.next}
              length={props.stories.length}
              currentStory={currentStory}
              active={
                i === props.currentIndex ? 1 : i < props.currentIndex ? 2 : 0
              }
              isLoaded={props.isLoaded}
              pause={props.pause}
              style={{
                transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
                height: 0.5,
              }}
            />
          );
        }}
*/

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
  flat: {
    flexDirection: "row",
    height: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProgressArray;
