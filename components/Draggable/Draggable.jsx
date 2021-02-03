import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  // PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const Draggable = ({
  showDraggable,
  editing,
  data,
  setEditing,
  setText,
  setFontSize,
  setTextColor,
  setTextBoxVisible,
  onDeleteText,
}) => {
  const [dropAreaValues, setDropAreaValues] = useState(null);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const [scaling, setScaling] = useState(1);
  const [canDelete, setCanDelete] = useState(false);
  // const [hold, setHold] = useState(false);
  const [clicked, setClicked] = useState(false);
  let _val = { x: 0, y: 0 };
  let _cVal = { x: 0, y: 0 };
  useEffect(() => {
    pan.addListener((value) => {
      _val = value;
      const shortP = setTimeout(() => {
        if (_val.x === _cVal.x && _val.y === _cVal.y) {
          setClicked(true);
        }
      }, 500);
      const longP = setTimeout(() => {
        if (_val.x === _cVal.x && _val.y === _cVal.y) {
          setCanDelete(true);
          setClicked(false);
        }
      }, 1000);
      if (_val.x !== _cVal.x && _val.y !== _cVal.y) {
        setCanDelete(false);
        clearTimeout(shortP);
        clearTimeout(longP);
      }

      // wait(1000).then();
    });
  }, [editing, canDelete, clicked]);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => {
      setClicked(false);
      // setHold(true);
      return true;
    },
    onPanResponderGrant: (e, gesture) => {
      _cVal = {
        x: _val.x,
        y: _val.y,
      };
      pan.setOffset({
        x: _val.x,
        y: _val.y,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gesture) => {
      window.clearTimeout();
      if (clicked) {
        setCanDelete(false);
        setEditing(data);
        setText(data.data);
        setFontSize(data.fontSize);
        setTextColor(data.color);
        setTextBoxVisible(true);
      }
      // setHold(true);
      // if (isDropArea(gesture)) {
      //   Animated.timing(opacity, {
      //     toValue: 0,
      //     duration: 1000,
      //     useNativeDriver: false,
      //   }).start(() => {});
      // }
    },
  });
  function isDropArea(gesture) {
    return gesture.moveY < 50;
  }
  let scale = new Animated.Value(scaling);

  const onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: scaling },
      },
    ],
    {
      useNativeDriver: true,
    }
  );
  const onZoomStateChange = (event) => {
    setScaling(scaling + 0.2);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scaling, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  function renderDraggable() {
    const panStyle = {
      transform: pan.getTranslateTransform(),
    };
    if (showDraggable) {
      return (
        <Animated.View
          {...panResponder.panHandlers}
          style={[panStyle, styles.circle, { opacity: opacity }]}
        >
          {canDelete ? (
            <View>
              <TouchableOpacity
                onPress={() => onDeleteText(data.id)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -20,
                  left: 0,
                  right: 0,
                  zIndex: 90,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="close" size={24} color="red" />
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <Text
            numberOfLines={10}
            style={{
              width: "100%",
              color: data.color,
              fontSize: data.fontSize,
              textAlign: "center",
            }}
          >
            {data.data}
          </Text>
        </Animated.View>
      );
    }
  }
  {
    /* <PinchGestureHandler
      onGestureEvent={onZoomEvent}
      onHandlerStateChange={onZoomStateChange}
    > 
   </PinchGestureHandler> */
  }
  return (
    <View style={{ width: "20%", alignItems: "center" }}>
      {renderDraggable()}
    </View>
  );
};

export default Draggable;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  circle: {
    width: Dimensions.get("screen").width,
    backgroundColor: "#00000001",
    position: "relative",
    // flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  dropZone: {
    height: 200,
    backgroundColor: "#00334d",
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
});
