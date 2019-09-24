import React from "react";
import LoginPage from "./src/components/LoginPage";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

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

export default function App() {
  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
}
