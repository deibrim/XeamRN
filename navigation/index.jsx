import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
// import { ColorSchemeName } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LandingScreen from "../screens/LandingScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import firebase, {
  auth,
  createUserProfileDocument,
  firestore,
} from "../firebase/firebase.utils";
import {
  setCurrentUser,
  setCurrentUserTvProfile,
  setCurrentUserXStore,
  toggleHasNoty,
} from "../redux/user/actions";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { setShoppingBagSize } from "../redux/shopping/actions";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({ colorScheme }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged(async (User) => {
      if (User) {
        console.log(User);
        const userRef = await createUserProfileDocument(User);
        userRef.onSnapshot(async (snapShot) => {
          const data = { id: snapShot.id, ...snapShot.data() };
          dispatch(setCurrentUser(data));
          data.emailVerified === false &&
            User.emailVerified === true &&
            snapShot.ref.update({ emailVerified: true });
          if (snapShot.data().isTvActivated) {
            const userRef = firestore.doc(`xeamTvs/${snapShot.id}`);
            const snapshot = await userRef.get();
            dispatch(setCurrentUserTvProfile({ ...snapshot.data() }));
          }
          if (snapShot.data().isBusinessAccount) {
            const xStoreRef = firestore.doc(`xeamStores/${snapShot.id}`);
            const snapshot = await xStoreRef.get();
            dispatch(setCurrentUserXStore({ ...snapshot.data() }));
          }

          const activitiesSnapshot = await firestore
            .collection("activity_feed")
            .doc(snapShot.id)
            .collection("feedItems")
            .where("viewed", "==", false);
          activitiesSnapshot.onSnapshot(async (snapShot) => {
            if (snapShot.size > 0) {
              dispatch(toggleHasNoty(true));
            }
          });
          const shoppingBagRef = await firestore
            .collection("shoppingBags")
            .doc(snapShot.id)
            .collection("products");
          shoppingBagRef.onSnapshot(async (snapShot) => {
            if (snapShot.size > 0) {
              let count = 0;
              snapShot.docs.forEach((doc) => {
                count = count + doc.data().quantity;
              });
              dispatch(setShoppingBagSize(count));
            } else {
              dispatch(setShoppingBagSize(0));
            }
          });
          const timelineSnapshot = await firestore
            .collection("timeline")
            .doc(snapShot.id)
            .collection("timelineReels")
            .get();
          timelineSnapshot.docs.length > 0
            ? dispatch(
                setCurrentUser({
                  id: snapShot.id,
                  ...snapShot.data(),
                  isTimelineEmpty: false,
                })
              )
            : dispatch(
                setCurrentUser({
                  id: snapShot.id,
                  ...snapShot.data(),
                  isTimelineEmpty: true,
                })
              );
          firebase
            .database()
            .ref(".info/connected")
            .on("value", (snap) => {
              if (snap.val() === true) {
                const ref = firebase
                  .database()
                  .ref("presence")
                  .child(snapShot.id);
                ref.set({ status: true });
                ref.onDisconnect().remove((err) => {
                  if (err !== null) {
                    console.log(err);
                  }
                });
              }
            });
        });
      }
    });
  }, []);

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {currentUser ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator();

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Root" component={BottomTabNavigator} />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </RootStack.Navigator>
  );
}

const AuthStack = createStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Root"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register" }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <AuthStack.Screen
        name="Reset"
        component={ForgotPasswordScreen}
        options={{ title: "Reset Password" }}
      />
    </AuthStack.Navigator>
  );
}

export default Navigation;
