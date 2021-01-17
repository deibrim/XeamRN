import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  Share,
  Modal,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
} from "react-native";
import { QRCode } from "react-native-custom-qr-codes-expo";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
// import CameraRoll from "@react-native-community/cameraroll";
import * as MediaLibrary from "expo-media-library";
import AppButton from "../AppButton/AppButton";
// import firebase, { firestore } from "../../firebase/firebase.utils";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { styles } from "./styles";

const QrCodeModal = ({ modalVisible, setModalVisible, activeQrCode, uri }) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraRollUri, setCameraRollUri] = useState("");
  const captureViewRef = useRef();
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  }, []);
  const onCapture = async (share) => {
    try {
      let result = await captureRef(captureViewRef, {
        quality: 1,
        format: "png",
      });
      const asset = await MediaLibrary.createAssetAsync(result);
      setCameraRollUri(asset.uri);
      share &&
        (await Sharing.shareAsync(asset.uri, {
          dialogTitle: "Follow me on Xeam",
        }));
      // share && onShare(asset.uri);
    } catch (snapshotError) {
      console.error(snapshotError);
    }
  };
  async function onShare(uri) {
    console.log(uri);
    Share.share(
      {
        title: "test title",
        url: uri,
        message: `Scan this to follow me on Xeam App`,
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
  }
  return (
    <>
      <View style={{ position: "absolute", top: 0 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
          style={{
            width: "100%",
            height: Dimensions.get("screen").height,
          }}
        >
          <View style={styles.container}>
            <ViewShot ref={captureViewRef}>
              <View style={styles.codeContainer}>
                <QRCode
                  content={
                    activeQrCode === "myqr"
                      ? `${user.id}_myqr`
                      : activeQrCode === "tvqr"
                      ? `${tv.id}_tvqr`
                      : `${store.id}_storeqr`
                  }
                  linearGradient={["#006eff74", "#006eff84"]}
                  outerEyeStyle="circle"
                  innerEyeStyle="circle"
                  codeStyle="dot"
                  size={(230, 230)}
                />
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "#006eff95",
                      marginTop: 30,
                    }}
                  >
                    Scan to follow
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      textTransform: "uppercase",
                      color: "#006eff95",
                      marginVertical: 10,
                      fontWeight: "700",
                    }}
                  >
                    @
                    {activeQrCode === "myqr"
                      ? `${user.username}`
                      : activeQrCode === "tvqr"
                      ? `${tv.tvHandle}`
                      : `${store.storeHandle}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "#006eff95",
                      // fontWeight: "700",
                    }}
                  >
                    On Xeam App
                  </Text>
                </View>
              </View>
            </ViewShot>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
              }}
            >
              <AppButton
                onPress={() => {
                  onCapture(false);
                }}
                title={"Save to Device"}
                customStyle={{
                  width: "65%",
                  margin: 10,
                  backgroundColor: "#fff",
                }}
                textStyle={{ fontSize: 13, color: "#006eff" }}
              />
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                  elevation: 2,
                  backgroundColor: "#006eff",
                }}
                onPress={() => onCapture(true)}
              >
                <AntDesign name="sharealt" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ position: "absolute", top: 10, left: 10 }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 35,
                height: 35,
                borderRadius: 20,
                elevation: 2,
                backgroundColor: "#ecf2fa",
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <AntDesign name="close" size={20} color="#ff4747" />
            </TouchableOpacity>
          </View>
          {/* <View style={{ position: "absolute", top: 10, right: 10 }}>
           
          </View> */}
          {errorMessage.trim() !== "" ? (
            <View
              style={{
                position: "absolute",
                top: 110,
                width: "100%",
                alignItems: "center",
              }}
            >
              <CustomPopUp
                message={`${errorMessage}`}
                type={"error"}
                customStyles={{
                  backgroundColor: "red",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                customTextStyles={{ color: "#ffffff", textAlign: "center" }}
              />
            </View>
          ) : null}
        </Modal>
      </View>
    </>
  );
};

export default QrCodeModal;
