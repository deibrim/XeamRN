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
      setClicked(true);
      _val = value;
      // Animated.timing(_val, {
      //   duration: 1000,
      //   delay: 0,
      //   useNativeDriver: false,
      // }).start(({ finished }) => {
      //   if (_val.x === _cVal.x && _val.y === _cVal.y) {
      //     setCanDelete(true);
      //     setClicked(false);
      //   }
      // });
      setTimeout(() => {
        if (_val.x === _cVal.x && _val.y === _cVal.y) {
          setCanDelete(true);
          setClicked(false);
        }
      }, 1000);
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
        // <View
        //   style={{ position: "absolute", width: "100%", left: 0, right: 0 }}
        // >
        <Animated.View
          {...panResponder.panHandlers}
          style={[panStyle, styles.circle, { opacity: opacity }]}
        >
          {canDelete ? (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setShowDraggable(false)}
                style={{ position: "absolute" }}
              >
                <AntDesign name="close" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ) : null}
          {/* <TouchableWithoutFeedback
            activeOpacity={1}
            delayLongPress={200}
            onPress={() => {
              setCanDelete(false);
              setEditing(data);
            }}
            onLongPress={() => {
              setCanDelete(true);
            }}
            style={
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 0,
                backgroundColor: "#00000001",
              }
            }
          > */}
          <Text
            numberOfLines={10}
            style={{
              // flex: 1,
              width: "100%",
              color: data.color,
              fontSize: data.fontSize,
              textAlign: "center",
            }}
          >
            {data.data}
          </Text>
          {/* </TouchableWithoutFeedback> */}
        </Animated.View>
        // </View>
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
