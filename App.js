import React, { Component } from "react";
import {
  Text,
  ActivityIndicatorComponent,
  View,
  Button,
  Modal,
  StyleSheet
} from "react-native";

import { connect } from "react-redux";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer, withNavigationFocus } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";
import TextCamera from "./src/components/TextCamera";
import MapScreen from "./src/components/MapScreen";
// import { Icon } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import Profile from "./src/components/Profile";
import axios from "axios";
import MenuScreen from "./src/components/MenuScreen";
import UserScreen from "./src/components/UserScreen";
import EventDetailScreen from "./src/components/EventDetailScreen";
import { Menu } from "react-native-paper";
import { createBottomTabNavigator } from "react-navigation-tabs";

// bottom tab routes here may wanna moduliza later
const MainNavigator = createBottomTabNavigator(
  {
    Map: {
      screen: MapScreen
    },
    Camera: {
      screen: withNavigationFocus(TextCamera)
    },
    Setting: {
      screen: Profile
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Icon;
        let iconName = "";

        switch (routeName) {
          case "Map":
            iconName = "map";
            break;
          case "Camera":
            iconName = "linked-camera";
            break;
          case "Setting":
            iconName = "person-outline";
            break;
          default:
            return;
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "lightgrey"
    },
    initialRouteName: "Map",
    order: ["Map", "Camera", "Setting"]
  }
);

// routing here for now maybe modulize later

const AuthStack = createStackNavigator(
  {
    SignIn: { screen: Login },
    Signup: { screen: Signup },
    Profile: { screen: Profile },
    EventDetail: { screen: EventDetailScreen },
    UserScreen: { screen: UserScreen },
    MainNavigator: {
      screen: MainNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "SignIn",
    defaultNavigationOptions: { header: null, headerVisible: false }
  }
);


const loginStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, userEmail: action.email };
    case "SET_PASSWORD":
      return { ...state, userPassword: action.password };
    default:
      return state;
  }
};

const signupStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, signupNewUser: action.username };
    default:
      return state;
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined) return { userCurrentLocation: null };
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
    default:
      return state;
  }
};

const userProfileStateReducer = (state, action) => {
  if (state === undefined) return { userInterests: [], genderChecked: null };

  switch (action.type) {
    case "SET_GENDER_CHECKED":
      return { ...state, genderChecked: action.check };
    case "SET_USERNAME":
      return { ...state, username: action.name };
    case "SET_INTEREST":
      return {
        ...state,
        userInterests: [...state.userInterests, action.interest]
      };
    case "REMOVE_INTEREST":
      return {
        ...state,
        userInterests: state.userInterests.filter(
          interest => interest !== action.interest
        )
      };
    default:
      return state;
  }
};

const cameraStateReducer = (state, action) => {
  if (state === undefined) return { hasCameraPermission: null, bounds: [{width: '10%', height: '10%', left: '40%', top: '40%' }] };
  switch (action.type) {
    case "SET_CAMERA":
      return { ...state, camera: action.value };
    case "SET_CAMERA_STATUS":
      return { ...state, hasCameraPermission: action.value };
    case "SET_IMAGE_BOUNDS":
      return { ...state, bounds: action.value };
    case "ACTION_IMAGE_AWS":
      state.camera.pausePreview();
      (async () => {
        const resp = await axios({
          method: "post",
          url: "http://172.46.3.175:3000/images",
          data: action.value
        });
        const bounds = resp.data.map(detection => {
          const bound = detection.geometry.boundingBox;
          console.log(JSON.stringify(detection));
          return {
            height: `${bound.height * 100}%`,
            width: `${bound.width * 100}%`,
            left: `${bound.left * 100}%`,
            top: `${bound.top * 100}%`
          };
        });
        store.dispatch({
          type: "SET_IMAGE_BOUNDS",
          value: bounds
        });
      })();
      return state;
    case "RESET_CAMERA":
      if (state.camera) {
        state.camera.resumePreview();
      }
      return { ...state, bounds: [] };
    default:
      return state;
  }
};

const eventDetailReducer = (state, action) => {
  if (state === undefined) return { selectedScreen: 'User' };

  switch (action.type) {
    case "SET_EVENT_SCREEN":
      return { ...state, selectedScreen: action.screen };
    default:
      return state;
  }
};

const reducer = combineReducers({
  loginCredentials: loginStateReducer,
  signupNewUser: signupStateReducer,
  cameraView: cameraStateReducer,
  userProfile: userProfileStateReducer,
  eventDetail: eventDetailReducer,
  findUserCurrentLocation: userCurrentlocationStateReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

const App = () => {
  const styles = StyleSheet.create({
    btn: {
      borderWidth: 5
    },
    main: {
      // paddingTop: 60,
      display: "flex",
      height: "100%",
      borderWidth: 5
    }
  });

  return (
    <View style={{ height: "100%", background: "black" }}>
      <AppNavigator />
    </View>
  );
};

const withProvider = AppComponent => {
  return () => (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
};

export default withProvider(App);
