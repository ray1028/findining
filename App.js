import React, { Component } from "react";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";
import MainScreen from "./src/components/MainScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Remote debugger"]);

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
      screen: Home,
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
    case "SET_EMAIL":
      return { ...state, userEmail: action.email };
    case "SET_PASSWORD":
      return { ...state, userPassword: action.password };
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
  }
};

const reducer = combineReducers({
  loginCredentials: loginStateReducer,
  signupNewUser: signupStateReducer,
  findUserCurrentLocation: userCurrentlocationStateReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
export default App;
