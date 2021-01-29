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

const StoriesViewModal = (props) => {
  const currentUser = useSelector((state) => state.currentUser);
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const [myStory, setMyStory] = useState([]);
  const [stories, setStories] = useState([]);
  const modalScroll = useRef(null);

  useEffect(() => {}, []);
  async function getStories() {
    const storiesRef = firestore
      .collection("stories")
      .doc(currentUser.id)
      .collection("stories");
    storiesRef.onSnapshot((snapshot) => {
      const storiesArr = [];
      const xeamStory = [];
      //   const myStory=[]
      snapshot.docs.forEach((item) => {
        if (item.userId === currentUser.id) {
          setMyStory(item);
          // myStory.push(item)
        }
        if (item.username === "xeam") {
          setMyStory(item);
          // myStory.push(item)
        }
        storiesArr.push(item);
      });
      setStories(storiesArr);
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
    if (AllStories.length - 1 > currentUserIndex) {
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
      console.log("next");
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      console.log("previous");
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={AllStories}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onStorySelect(index)}
            style={styles.userContainer}
          >
            <View style={styles.rounded}>
              <Image
                style={styles.roundedImage}
                source={{ uri: item.profile }}
                isHorizontal
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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
          {AllStories.map((item, index) => (
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
