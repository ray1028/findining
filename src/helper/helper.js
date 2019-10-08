import axios from "axios";
import { AsyncStorage } from "react-native";

const request = async params => {
  return axios({
    ...params,
    headers: {
      ...params.headers,
      "X-Token": await AsyncStorage.getItem("session_token")
    }
  });
};

const setSessionsToken = async token => {
  try {
    await AsyncStorage.setItem("session_token", token);
  } catch (error) {
    console.log("Error while setting token");
  }
};

const isSessionValid = async () => !!(await AsyncStorage.getItem("session_token"));

export { request, setSessionsToken, isSessionValid };
