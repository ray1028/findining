import axios from "axios";
import {AsyncStorage} from react-native

const request = async (params) => {
  return axios({
    ...params,
    headers: {...params.headers, token: await AsyncStorage.getItem('session_token')}
  });
};

const setSessionsToken = async (token) => {
  try {
    await AsyncStorage.setItem('session_token', token);
  } catch (error) {
    console.log('Error while setting token')
  }
  
}

export {request , setSessionsToken};
