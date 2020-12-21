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
import {
  auth,
  createUserProfileDocument,
  firestore,
} from "../firebase/firebase.utils";
import { setCurrentUser, setCurrentUserTvProfile } from "../redux/user/actions";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({ colorScheme }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged(async (User) => {
      if (User) {
        const userRef = await createUserProfileDocument(User);
        userRef.onSnapshot(async (snapShot) => {
          dispatch(setCurrentUser({ id: snapShot.id, ...snapShot.data() }));
          if (snapShot.data().isTvActivated) {
            const userRef = firestore.doc(`xeamTvs/${snapShot.id}`);
            const snapshot = await userRef.get();
            dispatch(setCurrentUserTvProfile({ ...snapshot.data() }));
          }
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
