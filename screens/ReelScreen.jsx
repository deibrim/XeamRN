import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import ReelPost from "../components/ReelPost/ReelPost";

const ReelScreen = () => {
  const route = useRoute();
  const reels = route.params.reelsArray;
  const navigation = useNavigation();
  const [currentReel, setCurrentReel] = useState({});
  const [flatListRef, setFlatListRef] = useState({});
  const [toggleScroll, setToggleScroll] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      // fetch all the posts
      try {
      } catch (e) {
        console.error(e);
      }
    };
    fetchPost();
  }, []);

  const onViewRef = useRef(({ viewableItems, changed }) => {
    const data = {
      isViewable: viewableItems[0].isViewable,
      index: viewableItems[0].index,
    };
    setCurrentReel(data);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={{ width: 60 }}>
              <Ionicons name="ios-arrow-back" size={24} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("CameraScreen")}
          >
            <Feather name="video" size={24} color="white" />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <FlatList
        data={reels}
        ref={(ref) => {
          setFlatListRef(ref);
        }}
        onViewableItemsChanged={onViewRef.current}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={route.params.selectedIndex}
        snapToInterval={Dimensions.get("window").height}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ReelPost
            post={item}
            index={index}
            currentReel={currentReel}
            toggleScroll={toggleScroll}
            setToggleScroll={setToggleScroll}
          />
        )}
        scrollEnabled={toggleScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    elevation: 4,
  },
});

export default ReelScreen;
