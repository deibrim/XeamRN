import { MaterialIcons, Feather } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import ReelPost from "../components/ReelPost/ReelPost";

const ReelScreen = React.memo(() => {
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
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 35,
              height: 35,
              borderRadius: 20,
              elevation: 2,
              backgroundColor: "#111111",
              opacity: 0.7,
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="navigate-before" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 20,
              elevation: 2,
              backgroundColor: "#111111",
              opacity: 0.7,
            }}
            onPress={() => navigation.navigate("CameraScreen")}
          >
            <Feather name="video" size={24} color="#ffffff" />
          </TouchableOpacity>
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
        removeClippedSubviews={false}
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
});

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
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
