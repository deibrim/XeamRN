import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { useRoute, useNavigation } from "@react-navigation/native";

import styles from "./styles";

const CreatePostScreen = () => {
  const [description, setDescription] = useState("");
  const [videoKey, setVideoKey] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();

  const uploadToStorage = async (imagePath) => {
    try {
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    uploadToStorage(route.params.videoUri);
  }, []);

  const onPublish = async () => {
    // create post in the database (API)
    if (!videoKey) {
      console.warn("VIdeo is not yet uploaded");
      return;
    }

    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const newPost = {
        videoUri: videoKey,
        description: description,
        userID: userInfo.attributes.sub,
        songID: "b6e2ee3a-04a7-4b25-aef5-90b41e4bba33",
      };
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={description}
        onChangeText={setDescription}
        numberOfLines={5}
        placeholder={"Description"}
        style={styles.textInput}
      />
      <TouchableOpacity onPress={onPublish}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Publish</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePostScreen;
