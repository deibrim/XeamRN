import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CubeNavigationHorizontal } from "react-native-3dcube-navigation";
import { useSelector } from "react-redux";
import AllStories from "../../constants/AllStories";
import { firestore } from "../../firebase/firebase.utils";
import StoryContainer from "../Stories/StoryContainer";
import { styles } from "./styles";

const StoriesViewModal = ({ togglePanel }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const [stories, setStories] = useState([]);
  const modalScroll = useRef(null);

  useEffect(() => {
    getStories();
  }, []);
  async function getStories() {
    const storiesRef = firestore
      .collection("stories")
      .doc(currentUser.id)
      .collection("stories")
      .orderBy("updatedAt", "desc");
    storiesRef.onSnapshot((snapshot) => {
      const storiesArr = [];
      const xeamStory = [];
      const myStory = [];
      snapshot.docs.forEach((item) => {
        if (item.data().userId === currentUser.id) {
          myStory.push(item.data());
        } else if (item.data().username === "xeam") {
          xeamStory.push(item.data());
        } else {
          storiesArr.push(item.data());
        }
      });
      setStories([...myStory, ...xeamStory, ...storiesArr]);
    });
  }
  const onStorySelect = (index) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex + 1;
    const checker = stories.length ? stories.length - 1 : AllStories.length - 1;
    if (checker > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {stories.length && stories[0].userId !== currentUser.id ? (
          <TouchableOpacity onPress={togglePanel} style={styles.userContainer}>
            <View style={styles.rounded}>
              <Image
                style={styles.roundedImage}
                source={{ uri: currentUser.profile_pic }}
                isHorizontal
              />
            </View>
            <Text style={styles.title}>Add story</Text>
          </TouchableOpacity>
        ) : null}
        <FlatList
          data={stories.length ? stories : AllStories}
          horizontal
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onStorySelect(index)}
              style={styles.userContainer}
            >
              <View style={styles.rounded}>
                <Image
                  style={styles.roundedImage}
                  source={{ uri: item.profile_pic }}
                  isHorizontal
                />
              </View>
              <Text style={styles.title}>
                {item.userId === currentUser.id ? "You" : item.username}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        statusBarTranslucent={true}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}
        >
          {stories.length
            ? stories.map((item, index) => (
                <StoryContainer
                  ksy={index}
                  onClose={onStoryClose}
                  onStoryNext={onStoryNext}
                  onStoryPrevious={onStoryPrevious}
                  user={item}
                  isNewStory={index !== currentUserIndex}
                  index={index}
                />
              ))
            : AllStories.map((item, index) => (
                <StoryContainer
                  ksy={index}
                  onClose={onStoryClose}
                  onStoryNext={onStoryNext}
                  onStoryPrevious={onStoryPrevious}
                  user={item}
                  isNewStory={index !== currentUserIndex}
                  index={index}
                />
              ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

export default StoriesViewModal;
