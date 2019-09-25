import React, { Component } from "react";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";

// routing here for now maybe modulize later

const AuthStack = createStackNavigator({
  Home: { screen: Home },
  SignIn: { screen: Login },
  Signup: { screen: Signup }
});

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

const reducer = combineReducers({
  loginCredentials: loginStateReducer
});

const store = createStore(reducer);

// const AppNavigator = createAppContainer(MainNavigator);
const AppNavigator = createAppContainer(
  createSwitchNavigator({
    Auth: AuthStack
  })
);

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
