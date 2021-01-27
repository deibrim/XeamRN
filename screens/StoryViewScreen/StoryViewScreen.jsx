import React, { useState } from "react";
import { View, FlatList } from "react-native";

import { Video } from "expo-av";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import UserStoryViewContainer from "../../components/UserStoryViewContainer/UserStoryViewContainer";

const StoryViewScreen = () => {
  const [userStories, setUserStories] = useState(["", ""]);
  let flatListRef;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={(ref) => (flatListRef = ref)}
        style={{ flex: 1 }}
        data={userStories}
        extraData={userStories}
        renderItem={({ item, index }) => <UserStoryViewContainer data={item} />}
        initialScrollIndex={0}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        // getItemLayout={(item, index) => ({
        //   index,
        //   length: layoutWidth,
        //   offset: layoutWidth * index,
        // })}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `slide_item_${index}`}
      />
    </View>
  );
};

export default StoryViewScreen;
