import React, { Component } from "react";
import { Text, ActivityIndicatorComponent } from "react-native";
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
import Profile from "./src/components/Profile";
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
    Profile: { screen: Profile },
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
      return { ...state, signupNewUser: action.username };
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
  if (state === undefined) return { hasCameraPermission: null, bounds: [] };
  switch (action.type) {
    case "SET_CAMERA":
      return { ...state, camera: action.value };
    case "SET_CAMERA_STATUS":
      return { ...state, hasCameraPermission: action.value };
    case "SET_IMAGE_BOUNDS":
      return { ...state, bounds: action.value };
    case "ACTION_IMAGE_AWS":
      state.camera.pausePreview();
      // const dimensions = {
      //   width: action.value.meta.PixelXDimension,
      //   height: action.value.meta.PixelYDimension
      // };
      (async () => {
        const resp = await axios({
          method: "post",
          url: "http://172.46.3.175:3000/images",
          data: action.value
        });
        const bounds = resp.data.map(detection => {
          const bound = detection.geometry.boundingBox;
          return {
            height: `${bound.height * 100}%`,
            width: `${bound.width * 100}%`,
            left: `${bound.left * 100}%`,
            top: `${bound.top * 100}%`
          };
        });
        console.log(bounds);
        store.dispatch({
          type: "SET_IMAGE_BOUNDS",
          value: bounds
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
  cameraView: cameraStateReducer,
  userProfile: userProfileStateReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {/* <Profile /> */}
        {/* <AppNavigator /> */}
        {/* <TextCamera /> */}
        {/* <Text>Test</Text> */}
      </Provider>
    );
  }
}
export default App;
