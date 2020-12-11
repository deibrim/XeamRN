import {
  FontAwesome5,
  Ionicons,
  Entypo,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Share,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import SettingsItemWrapper from "../components/SettingsItemWrapper/SettingsItemWrapper";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function SettingsScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  onShare = async () => {
    const uri = "../assets/xlogowhite.png";

    Share.share(
      {
        title: "test title",
        url: uri,
        message: `Hey there, I'm using Xeam to ---. Join me! Download it here: https://remedi.store`,
      },
      {
        excludedActivityTypes: [
          // 'com.apple.UIKit.activity.PostToWeibo',
          "com.apple.UIKit.activity.Print",
          // "com.apple.UIKit.activity.CopyToPasteboard",
          // 'com.apple.UIKit.activity.AssignToContact',
          "com.apple.UIKit.activity.SaveToCameraRoll",
          "com.apple.UIKit.activity.AddToReadingList",
          // 'com.apple.UIKit.activity.PostToFlickr',
          // 'com.apple.UIKit.activity.PostToVimeo',
          // 'com.apple.UIKit.activity.PostToTencentWeibo',
          "com.apple.UIKit.activity.AirDrop",
          "com.apple.UIKit.activity.OpenInIBooks",
          "com.apple.UIKit.activity.MarkupAsPDF",
          "com.apple.reminders.RemindersEditorExtension",
          // 'com.apple.mobilenotes.SharingExtension',
          // 'com.apple.mobileslideshow.StreamShareService',
          // 'com.linkedin.LinkedIn.ShareExtension',
          // 'pinterest.ShareExtension',
          // 'com.google.GooglePlus.ShareExtension',
          // 'com.tumblr.tumblr.Share-With-Tumblr',
          // 'net.whatsapp.WhatsApp.ShareExtension', //WhatsApp
        ],
      }
    );
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
              <Text style={styles.title}>Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
          style={{
            width: "100%",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: "#ffffff",
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.modalText}>Hello World!</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>close Modal</Text>
              </TouchableHighlight>
            </View>
            <TouchableOpacity style={{ marginTop: "auto" }} onPress={() => {}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          <SettingsItemWrapper
            title={"Tv Account"}
            description={"Entertain your viewers "}
            icon={<Feather name="tv" size={20} color="white" />}
            onPress={() => setModalVisible(true)}
          />
          <SettingsItemWrapper
            title={"Store Account"}
            description={"Sell your product with ease"}
            icon={<FontAwesome5 name="store-alt" size={20} color="white" />}
            onPress={() => navigation.navigate("EditChatScreen")}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>
          <SettingsItemWrapper
            title={"Chat"}
            description={"Customize your chat room"}
            icon={
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color="white"
              />
            }
            onPress={() => navigation.navigate("EditChatScreen")}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MISCELLANEOUS</Text>
          <SettingsItemWrapper
            title={"Bug report"}
            description={"Report bug very simply"}
            icon={<Entypo name="bug" size={20} color="white" />}
            onPress={() => navigation.navigate("ReportBugScreen")}
            backgroundColor={"gray"}
          />
          <SettingsItemWrapper
            title={"Share the app"}
            description={"Share this app with your friends"}
            icon={<Feather name="share-2" size={20} color="white" />}
            onPress={onShare}
          />
        </View>
        <View style={styles.copyright}>
          <Text style={{ color: "gray", fontSize: 16, marginBottom: 10 }}>
            Xeam-Beta v1.0
          </Text>
          <Text style={{ color: "gray", fontSize: 16, marginBottom: 5 }}>
            From
          </Text>
          <Text style={{ color: "#006eff", fontSize: 16, fontWeight: "bold" }}>
            Xeam
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    color: "#42414C",
    fontSize: 18,
    marginBottom: 1,
  },
  section: {
    marginVertical: 20,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sectionTitle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 5,
    fontWeight: "bold",
    color: "gray",
  },
  copyright: {
    position: "absolute",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
  button: {
    // borderRadius: 30,
    backgroundColor: "#006eff",
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
