import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, PanResponder, Animated } from "react-native";
import {
  PinchGestureHandler,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";

const Draggable = ({ widget, showDraggable, data, setEditing }) => {
  const [dropAreaValues, setDropAreaValues] = useState(null);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const [scaling, setScaling] = useState(1);
  const [canDelete, setCanDelete] = useState(false);
  let _val = { x: 0, y: 0 };
  useEffect(() => {
    pan.addListener((value) => (_val = value));
  }, []);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => true,
    onPanResponderGrant: (e, gesture) => {
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
    console.log(event);
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
        <View style={{ position: "absolute" }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[panStyle, styles.circle, { opacity: opacity }]}
          >
            {canDelete ? (
              <View style={{ position: "absolute", right: 0, top: 0 }}>
                <TouchableOpacity
                  onPress={() => setShowDraggable(false)}
                  style={{ position: "absolute" }}
                >
                  <AntDesign name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity
              activeOpacity={1}
              delayLongPress={200}
              onPress={() => {
                setCanDelete(false);
                setEditing(data);
              }}
              onLongPress={() => setCanDelete(true)}
              style={{ position: "relative", zIndex: 5 }}
            >
              {/* <PinchGestureHandler
              onGestureEvent={onZoomEvent}
              onHandlerStateChange={onZoomStateChange}
            > */}
              <Animated.Text
                style={{
                  transform: [{ scale: scaling }],
                  color: data.color,
                  fontSize: data.fontSize,
                  //   fontSize: scale,
                }}
              >
                {data.data}
              </Animated.Text>
            </TouchableOpacity>
            {/* </PinchGestureHandler> */}
          </Animated.View>
        </View>
      );
    }
  }
  return (
    <View style={{ width: "20%", alignItems: "center" }}>
      {renderDraggable()}
    </View>
  );
};

export default Draggable;
let CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  ballContainer: {
    height: 200,
  },
  //   circle: {
  //     backgroundColor: "skyblue",
  //     width: CIRCLE_RADIUS * 2,
  //     height: CIRCLE_RADIUS * 2,
  //     borderRadius: CIRCLE_RADIUS,
  //   },
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
