import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
      <Input
        placeholder="Email"
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        leftIcon={
          <Icon
            name="envelope"
            size={24}
            color="white"
            style={styles.inputBox}
            errorMessage="ENTER A VALID ERROR HERE"
          />
        }
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder="Password"
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        leftIcon={
          <Icon
            name="lock"
            size={32}
            color="white"
            style={styles.inputBox}
            errorMessage="ENTER A VALID ERROR HERE"
          />
        }
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity
        activeOpacity={0.2}
        style={styles.submitButton}
        onPress={() =>
          console.log("useremail is " + email + " userpassword is " + password)
        }
      >
        <Text style={styles.submitText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: 23,
    width: "100%",
    justifyContent: "center"
  },
  iconTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1,
    color: "white"
  },
  submitButton: {
    backgroundColor: "#7a42f4",
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: "center"
  },
  submitText: {
    color: "white"
  },
  inputBox: {
    margin: 20,
    width: "80%"
  }
});
