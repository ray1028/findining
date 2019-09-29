import React, { Component } from "react";
import { Text } from "react-native";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";
import TextCamera from "./src/components/TextCamera";
import MainScreen from "./src/components/MainScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

// bottom tab routes here may wanna moduliza later
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: MainScreen,
      navigationOption: {
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} color="white" />
          </View>
        )
      }
    },
    Camera: {
      screen: TextCamera,
      navigationOption: {
        tabBarLabel: "Camera",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} />
          </View>
        )
      }
    },
    Setting: {
      screen: Home,
      navigationOption: {
        tabBarLabel: "Setting",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} />
          </View>
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    order: ["Home", "Camera", "Setting"]
  }
);

// routing here for now maybe modulize later

const AuthStack = createStackNavigator(
  {
    // Splash: { screen: Splash },
    SignIn: { screen: Login },
    Signup: { screen: Signup },
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  { initialRouteName: "SignIn" }
);

// MainNavigator

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
      return { ...state, userName: action.username };
    default:
      return state;
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
  }
};

const cameraStateReducer = (state, action) => {
  if (state === undefined) return { hasCameraPermission: null };
  switch (action.type) {
    case "SET_CAMERA":
      return { ...state, camera: action.value };
    case "SET_CAMERA_STATUS":
      return { ...state, hasCameraPermission: action.value };
    case "ACTION_IMAGE_AWS":
      (async () => {
        const resp = await axios({
          method: "post",
          url: "http://172.46.3.175:3000/images",
          data: action.value
        });
      })();
      return state;
    default:
      return state;
  }
};

const reducer = combineReducers({
  loginCredentials: loginStateReducer,
  signupNewUser: signupStateReducer,
  // findUserCurrentLocation: userCurrentlocationStateReducer || null,
  camera: cameraStateReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {/* <AppNavigator /> */}
        <TextCamera />
        {/* <Text>Test</Text> */}
      </Provider>
    );
  }
}
export default App;
