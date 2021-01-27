import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Dialog from "react-native-popup-dialog";
import { useDispatch, useSelector } from "react-redux";
import firebase, { auth, firestore } from "../../firebase/firebase.utils";
import {
  setCurrentUser,
  setCurrentUserTvProfile,
  setCurrentUserXStore,
} from "../../redux/user/actions";
import { styles } from "./styles";

const DeleteAccountsContainer = ({ title, value }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [toggleShowCurrentPassword, setToggleShowCurrentPassword] = useState(
    false
  );
  const [deleting, setDeleting] = useState(false);
  const [reAuth, setReAuth] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const onTitlePress = () => {
    setVisible(!visible);
  };

  const DeleteProfile = async () => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    const currentUserAuth = auth.currentUser;
    try {
      const reAuth = await currentUserAuth.reauthenticateWithCredential(
        credential
      );
      if (reAuth.user) {
        currentUserAuth
          .delete()
          .then(function () {
            firestore.collection("users").doc(currentUser.id).delete();
            auth.signOut();
            dispatch(setCurrentUser(null));
            dispatch(setCurrentUserTvProfile(null));
            dispatch(setCurrentUserXStore(null));
          })
          .catch(function (error) {
            console.log(error);
            setErrorMessage("Something went wrong");
          });
      }
    } catch (error) {
      setErrorMessage("Current password is incorrect");
      setErrorMessage(err.message);
    }
  };
  const DeleteTvProfile = async () => {
    firestore.collection("xeamTvs").doc(currentUser.id).delete();
  };
  const DeleteStore = async () => {
    firestore.collection("xeamStores").doc(currentUser.id).delete();
  };
  return (
    <>
      <Dialog
        visible={dialogVisible}
        onTouchOutside={() => {
          setDeleting(false);
          setDialogVisible(false);
        }}
        width={0.8}
      >
        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
          <View style={{ minHeight: 100 }}>
            <View style={styles.customDialogTitle}>
              <Text
                style={[
                  styles.username,
                  {
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#ff0000",
                  },
                ]}
              >
                Delete {accountType}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: " 100%",
                paddingBottom: 20,
                paddingTop: 10,
              }}
            >
              {deleting ? (
                <Text>Sad to see you go</Text>
              ) : (
                <View style={{ flexDirection: "column" }}>
                  <View>
                    <Text>Are you sure you want to delete?</Text>
                  </View>
                  {accountType === "Profile" ? (
                    <View style={styles.inputGroup}>
                      {/* <AntDesign
                        style={styles.inputGroupIcon}
                        name="lock"
                        size={22}
                        color="black"
                      /> */}
                      <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        secureTextEntry={
                          !toggleShowCurrentPassword ? true : false
                        }
                        placeholder="Current password"
                        placeholderTextColor="#000000"
                        autoFocus={true}
                        autoCapitalize="none"
                        onChangeText={(e) => {
                          setErrorMessage("");
                          setReAuth(true);
                          setCurrentPassword(e);
                        }}
                        value={currentPassword}
                      />
                      {/* <TouchableWithoutFeedback
                        onPress={() =>
                          setToggleShowCurrentPassword(
                            !toggleShowCurrentPassword
                          )
                        }
                      >
                        <Feather
                          name={toggleShowCurrentPassword ? "eye-off" : "eye"}
                          size={20}
                          color="black"
                          style={{ marginRight: 10 }}
                        />
                      </TouchableWithoutFeedback> */}
                    </View>
                  ) : null}
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={[styles.modalTextButton, { backgroundColor: "#ffffff" }]}
                onPress={() => {
                  setDeleting(false);
                  setDialogVisible(false);
                }}
              >
                <Text style={styles.modalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => {
                  if (deleting) {
                    if (accountType.includes("Tv")) {
                      DeleteTvProfile();
                      setDeleting(false);
                      setDialogVisible(false);
                    } else if (accountType.includes("tore")) {
                      DeleteStore();
                      setDeleting(false);
                      setDialogVisible(false);
                    } else if (accountType === "Profile" && reAuth) {
                      DeleteProfile();
                      setDeleting(false);
                      setDialogVisible(false);
                    } else {
                      setReAuth(true);
                    }
                  } else {
                    setDeleting(true);
                  }
                }}
              >
                <Text style={[styles.modalText, { color: "#ffffff" }]}>
                  {deleting ? "Delete" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Dialog>
      <View style={styles.deleteContainer}>
        <View style={[styles.box, styles.theCompany]}>
          <TouchableWithoutFeedback onPress={onTitlePress}>
            <View style={styles.boxHead}>
              <Text style={styles.boxTitle}>Danger Zone</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="red"
                style={{
                  transform: [
                    {
                      rotate: visible ? "180deg" : "0deg",
                    },
                  ],
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {visible ? (
            <View style={styles.deleteContainerContent}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  setDialogVisible(true);
                  setAccountType("Profile");
                }}
              >
                <Text style={styles.deleteBtnText}>Delete Account</Text>
              </TouchableOpacity>
              {currentUser.isTvActivated && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    setDialogVisible(true);
                    setAccountType("Tv Profile");
                  }}
                >
                  <Text style={styles.deleteBtnText}>Delete Tv profile</Text>
                </TouchableOpacity>
              )}
              {currentUser.isBusinessAccount && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    setDialogVisible(true);
                    setAccountType("XStore");
                  }}
                >
                  <Text style={styles.deleteBtnText}>Delete XStore</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default DeleteAccountsContainer;

function DeleteModal(params) {}
