import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";

const StoriesPreviewContainer = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [xeamStory, setXeamStory] = useState(false);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingLeft: 11 }}
    >
      <StoryPreview
        source={{ uri: currentUser.profile_pic }}
        profile_pic=""
        username="You"
        viewed={false}
      />
      {xeamStory ? (
        <StoryPreview
          source={{ uri: currentUser.profile_pic }}
          profile_pic=""
          username=""
          viewed={false}
        />
      ) : null}
      <StoryPreview
        source={{ uri: currentUser.profile_pic }}
        profile_pic=""
        username=""
        viewed={false}
      />
    </ScrollView>
  );
};

export default StoriesPreviewContainer;

function StoryPreview({ source, username, viewed }) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("StoryViewScreen");
      }}
    >
      <View style={styles.storyPreviewContainer}>
        <View
          style={[
            styles.storyPreviewImageContainer,
            !viewed && { borderColor: "#006eff" },
          ]}
        >
          <Image style={styles.storyPreviewImage} source={source} />
        </View>
        <Text style={styles.storyPreviewText}>{username.substring(0, 5)}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
