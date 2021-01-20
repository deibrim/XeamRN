import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";

const DeleteAccountsContainer = ({ title, value }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [visible, setVisible] = useState(false);
  const onTitlePress = () => {
    setVisible(!visible);
  };
  return (
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
            <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
              <Text style={styles.deleteBtnText}>Delete account</Text>
            </TouchableOpacity>
            {currentUser.isTvActivated && (
              <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
                <Text style={styles.deleteBtnText}>Delete Tv profile</Text>
              </TouchableOpacity>
            )}
            {currentUser.isBusinessAccount && (
              <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
                <Text style={styles.deleteBtnText}>Delete XStore</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default DeleteAccountsContainer;
