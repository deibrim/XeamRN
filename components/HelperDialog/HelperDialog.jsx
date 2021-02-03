import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Dialog from "react-native-popup-dialog";
import { styles } from "./styles";

const HelperDialog = ({ dialogVisible, setDialogVisible, buttons, title }) => {
  return (
    <Dialog
      visible={dialogVisible}
      onTouchOutside={() => {
        setDialogVisible(false);
      }}
      width={0.9}
    >
      <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
        <View style={{ minHeight: 100 }}>
          {title && (
            <View style={styles.customDialogTitle}>
              <Text
                style={[
                  styles.username,
                  { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                ]}
              >
                {title}
              </Text>
            </View>
          )}
          {buttons.map((item, index) => (
            <TouchableOpacity
              style={[styles.modalTextButton]}
              onPress={item.onPress}
            >
              {item.icon && item.icon}
              <Text style={[styles.modalText, { color: item.textColor }]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Dialog>
  );
};

export default HelperDialog;
