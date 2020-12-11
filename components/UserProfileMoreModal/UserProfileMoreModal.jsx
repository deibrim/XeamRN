import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
// import { deleteReel } from "../../firebase/firebase.utils";

const UserProfileMoreModal = ({
  userId,
  userData,
  setShowMore,
  setReported,
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showReportModal, setShowReportModal] = useState(false);
  const onReportUser = () => {
    setReported(true);

    setShowReportModal(false);

    setShowMore(false);
  };
  const onRateTv = () => {
    setShowReportModal(false);
    setShowMore(false);
  };

  return (
    <>
      {showReportModal ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportUser("inappropriate")}
          >
            <Text style={styles.modalText}>Inappropriate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportUser("porn")}
          >
            <Text style={styles.modalText}>Pornography</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalTextButton}
            onPress={() => onReportUser("fake")}
          >
            <Text style={styles.modalText}>Fake account</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          {userId !== currentUser.id ? (
            <>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => setShowReportModal(true)}
              >
                <Text style={styles.modalText}>Report User</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.modalTextButton}
                onPress={onRateTv}
              >
                <Text style={styles.modalText}>Rate tv content</Text>
              </TouchableOpacity> */}
            </>
          ) : null}
        </View>
      )}
    </>
  );
};

export default UserProfileMoreModal;
