import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useNavigation } from "@react-navigation/native";
import { firestore } from "../../firebase/firebase.utils";

import styles from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const ReportBugScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [bugReport, setBugReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  const navigation = useNavigation();
  const onReport = useCallback(() => {
    setReported(true);
    wait(2000).then(() => setReported(false));
  }, []);
  const onBugReport = async () => {
    setLoading(true);
    const id = uuidv4().split("-").join("");
    if (bugReport.trim() === "") {
      console.log("Tell us about the issue");
      return;
    }
    try {
      const newBugReport = {
        id,
        issue: bugReport,
        userID: currentUser.id,
        username: currentUser.username,
      };
      firestore.collection("bug_reports").doc(id).set(newBugReport);
      setLoading(false);
      setBugReport("");
      onReport();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>Bug Report</Text>
      </View>

      <View style={styles.container}>
        <TextInput
          value={bugReport}
          onChangeText={setBugReport}
          numberOfLines={5}
          placeholder={"What went wrong?"}
          style={styles.textInput}
        />
        {reported ? (
          <View style={{ ...styles.centerContainer, opacity: 0.7 }}>
            <Text style={{ fontSize: 18, color: "#111111" }}>
              Thanks for your support!
            </Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={onBugReport}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Report</Text>
            {loading && (
              <Image
                style={{ marginTop: 2, marginLeft: 5, width: 18, height: 18 }}
                source={require("../../assets/loader.gif")}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ReportBugScreen;
