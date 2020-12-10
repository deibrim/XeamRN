import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { deleteReel } from "../../firebase/firebase.utils";
import { setSavePost } from "../../redux/save/actions";

const ReelPostMoreModal = ({ postOwnerId, postData, setShowMore, onSave }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const posts = useSelector((state) => state.save.posts);
  const [showReportModal, setShowReportModal] = useState(false);
  const onReportPost = () => {
    setShowReportModal(false);
    setShowMore(false);
  };
  const onSavePost = () => {
    const filterOut = posts.filter((post) => post.id !== postData.id);
    if (posts.length > 0) {
      dispatch(setSavePost([...filterOut, postData]));
      //   !isExisted && dispatch(setSavePost([...posts, postData]));
    } else {
      dispatch(setSavePost([postData]));
    }
    onSave();
    setShowMore(false);
  };
  const onDeletePost = () => {
    deleteReel(postOwnerId, postData.id);
    setShowMore(false);
  };
  return (
    <>
      {showReportModal ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportPost("inappropriate")}
          >
            <Text style={styles.modalText}>Inappropriate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportPost("porn")}
          >
            <Text style={styles.modalText}>Pornography</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportPost("copyright")}
          >
            <Text style={styles.modalText}>Contain copyright</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          {postOwnerId !== currentUser.id ? (
            <>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => setShowReportModal(true)}
              >
                <Text style={styles.modalText}>Report Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={onSavePost}
              >
                <Text style={styles.modalText}>Save Post</Text>
              </TouchableOpacity>
            </>
          ) : null}
          {postOwnerId === currentUser.id ? (
            <TouchableOpacity
              style={{
                ...styles.modalTextButton,
                borderBottomColor: "#FE524D",
              }}
              onPress={onDeletePost}
            >
              <Text style={{ ...styles.modalText, color: "#FE524D" }}>
                Delete Post
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </>
  );
};

export default ReelPostMoreModal;
