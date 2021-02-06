import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  View,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { EvilIcons } from "@expo/vector-icons";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";
import { DATA } from "../../constants/AllPosts";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import StoriesViewModal from "../../components/StoriesViewModal/StoriesViewModal";
import { firestore } from "../../firebase/firebase.utils";
import PostView from "../../components/PostView/PostView";

// https://www.creative-flyers.com

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height;
const VISIBLE_ITEMS = 3;

const OverflowItems = ({ data, scrollXAnimated }) => {
  const inputRange = [-1, 0, 1];
  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });
  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.title]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.itemContainerRow}>
                <Text style={[styles.location]}>
                  <EvilIcons
                    name="location"
                    size={16}
                    color="black"
                    style={{ marginRight: 5 }}
                  />
                  {item.location}
                </Text>
                <Text style={[styles.date]}>{item.date}</Text>
              </View>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const scrollXIndex = useRef(new Animated.Value(0)).current;
  const scrollXAnimated = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const user = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [currentReel, setCurrentReel] = useState({});
  const [flatListRef, setFlatListRef] = useState({});
  const [toggleScroll, setToggleScroll] = useState(true);

  const dispatch = useDispatch();

  const setActiveIndex = useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  useEffect(() => {
    if (index === data.length - VISIBLE_ITEMS - 1) {
      // get new data
      // fetch more data
      const newData = [...data, ...data];
      setData(newData);
    }
    getTimeline();
  });

  useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  });

  function getTimeline() {
    setLoading(true);
    const reelRef = firestore
      .collection("timeline")
      .doc(`${user.id}`)
      .collection("timelineReels")
      .orderBy("posted_at", "desc");
    reelRef.onSnapshot((snapshot) => {
      const reelsArr = [];
      snapshot.docs.forEach((doc) => {
        reelsArr.push(doc.data());
      });
      setData(reelsArr);
      setLoading(false);
    });
  }
  const togglePanel = () => {
    dispatch(toggleShowBottomNavbar(true));
    setIsPanelActive(true);
  };
  const onViewRef = useRef(({ viewableItems, changed }) => {
    const data = {
      isViewable: viewableItems[0].isViewable,
      index: viewableItems[0].index,
    };
    setCurrentReel(data);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <FlingGestureHandler
      key="up"
      direction={Directions.UP}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key="down"
        direction={Directions.DOWN}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        <View style={styles.container}>
          <View style={{ position: "absolute", top: 0, zIndex: 9 }}>
            <StoriesViewModal togglePanel={togglePanel} />
          </View>
          {/* <OverflowItems data={data} scrollXAnimated={scrollXAnimated} /> */}
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            contentContainerStyle={{
              flex: 1,
              paddingVertical: SPACING * 2,
            }}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            scrollEnabled={false}
            snapToAlignment={"start"}
            decelerationRate={"fast"}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: data.length - index }];
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              const inputRange = [index - 1, index, index + 1];
              const translateY = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
              });

              return (
                <Animated.View
                  style={{
                    position: "absolute",
                    // left: -ITEM_WIDTH / 2,
                    height,
                    width,
                    opacity,
                    transform: [
                      {
                        translateY,
                      },
                      { scale },
                    ],
                  }}
                >
                  <PostView
                    post={item}
                    index={index}
                    currentReel={currentReel}
                    toggleScroll={toggleScroll}
                    setToggleScroll={setToggleScroll}
                    width={ITEM_WIDTH}
                    height={ITEM_HEIGHT}
                  />
                  {/* <Image
                    source={{ uri: item.poster }}
                    style={{
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      borderRadius: 14,
                    }}
                  /> */}
                </Animated.View>
              );
            }}
          />
        </View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

export default HomeScreen;
