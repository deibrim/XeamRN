import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  Share,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";
// import firebase, { firestore } from "../../firebase/firebase.utils";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { styles } from "./styles";
import { firestore, handleFollowUser } from "../../firebase/firebase.utils";
import { handleFollowTv } from "../../firebase/tvFunctions";
import { handleFollowStore } from "../../firebase/storeFunctions";

const QrCodeScannerModal = ({
  qrCodeScannerModalVisible,
  setQrCodeScannerModalVisible,
}) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const analyseData = data.split("_");
    const id = analyseData[0];
    const userRef = firestore.doc(`users/${id}`);
    const snapshot = await userRef.get();
    const token = snapshot.data().push_token.data;

    if (analyseData[1] === "myqr") {
      user.id !== id && handleFollowUser(id, user, token);
    } else if (analyseData[1] === "tvqr") {
      tv.id !== id && handleFollowTv(id, user, token);
    } else if (analyseData[1] === "storeqr") {
      store.id !== id && handleFollowStore(id, user, token);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      BarCodeScanner.scanFromURLAsync(result.uri);
    }
  };
  return (
    <>
      <View style={{ position: "absolute", top: 0 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={qrCodeScannerModalVisible}
          onRequestClose={() => {}}
          style={{
            width: "100%",
            height: Dimensions.get("screen").height,
          }}
        >
          <View style={styles.container}>
            <BarCodeScanner
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: "80%", width: "80%" }}
            />
            <View style={styles.otherControl}>
              {scanned ? (
                <View
                  style={{
                    width: "80%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppButton
                    onPress={() => setScanned(false)}
                    title={"Scan Again"}
                    customStyle={{
                      width: "65%",
                      margin: 10,
                      backgroundColor: "#fff",
                    }}
                    textStyle={{ fontSize: 13, color: "#006eff" }}
                  />
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.selectFromPhoneContainer}
                onPress={() => pickImage()}
              >
                <View style={styles.selectFromPhone}>
                  <MaterialIcons
                    name="photo-size-select-actual"
                    size={30}
                    color="white"
                  />
                </View>
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
                setQrCodeScannerModalVisible(!qrCodeScannerModalVisible);
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

export default QrCodeScannerModal;
