import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const UserProfileMoreModal = ({
  userId,
  userData,
  tvData,
  storeData,
  setShowMore,
  setReported,
  currentUser,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const onBlacklistUser = async () => {
    const snapshot = await firestore
      .collection("blacklist")
      .doc(currentUser.id)
      .collection("list")
      .doc(userId)
      .get();
    if (snapshot.exists) {
      reset();
      return;
    } else {
      firestore
        .collection("blacklist")
        .doc(currentUser.id)
        .collection("list")
        .doc(userId)
        .set({});
    }
  };
  const onReportUser = async (type) => {
    const snapshot = await firestore
      .collection("blacklist")
      .doc(currentUser.id)
      .collection("list")
      .doc(userId)
      .get();
    if (snapshot.exists) {
      reset();
      return;
    } else {
      firestore
        .collection("blacklist")
        .doc(currentUser.id)
        .collection("list")
        .doc(userId)
        .set({});
      const reportUserData = {
        id: userData.id,
        username: userData.username,
      };
      const reportTvData = { id: tvData.id, tvHandle: tvData.tvHandle };
      const reportStoreData = {
        id: storeData.id,
        storeHandle: storeData.storeHandle,
      };
      if (type === "inappropriate") {
        reset();
      } else if (type === "porn") {
        reportUserData.reporters[currentUser.id] = true;
        reportTvData.reporters[currentUser.id] = true;
        reportStoreData.reporters[currentUser.id] = true;
        const hasReportStore =
          reportStoreData.reporters[currentUser.id] === true;
        const hasReportTv = reportTvData.reporters[currentUser.id] === true;
        const hasReportUser = reportUserData.reporters[currentUser.id] === true;
        const pornRef = firestore
          .collection("pornographyAccountReports")
          .doc(userData.id || tvData.id || reportTvData.id);
        !hasReportUser && userData && pornRef.set(reportUserData);
        !hasReportTv && tvData && pornRef.set(reportTvData);
        !hasReportStore && storeData && pornRef.set(reportStoreData);
        reset();
      } else if (type === "fake") {
        const fakeRef = firestore
          .collection("fakeAccountReports")
          .doc(userData.id || tvData.id || reportTvData.id);
        !hasReportUser && userData && fakeRef.set(reportUserData);
        !hasReportTv && tvData && fakeRef.set(reportTvData);
        !hasReportStore && storeData && fakeRef.set(reportStoreData);
        reset();
      }
    }
  };
  function reset() {
    setReported(true);
    setShowReportModal(false);
    setShowMore(false);
  }

  return showReportModal ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.modalTextButton, { justifyContent: "center" }]}
        onPress={() => onReportUser("inappropriate")}
      >
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          Inappropriate
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalTextButton, { justifyContent: "center" }]}
        onPress={() => onReportUser("porn")}
      >
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          Pornography
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalTextButton, { justifyContent: "center" }]}
        onPress={() => onReportUser("fake")}
      >
        <Text style={[styles.modalText, { textAlign: "center" }]}>
          Fake account
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.container}>
      <>
        <TouchableOpacity
          style={styles.modalTextButton}
          onPress={() => setShowReportModal(true)}
        >
          <AntDesign
            name="flag"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
          <Text style={styles.modalText}>
            Report {userData ? "User" : tvData ? "Tv" : "Store"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalTextButton}
          onPress={() => {
            onBlacklistUser();
          }}
        >
          <MaterialCommunityIcons
            name="block-helper"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
          <Text style={styles.modalText}>
            Block {userData ? "User" : tvData ? "Tv" : "Store"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalTextButton} onPress={() => {}}>
          <Feather
            name="bell"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
          <Text style={styles.modalText}>Turn on post notification</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

export default UserProfileMoreModal;
