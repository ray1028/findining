import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  // KeyboardAvoidingView,
  View,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";

const LoginForm = props => {
  return (
    <View style={styles.formContainer}>
      <Image
        style={styles.logo}
        source={require("../assets/images/findining.png")}
      />
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
        onChangeText={props.changeEmailInput}
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
        onChangeText={props.changePasswordInput}
      />
      <TouchableOpacity
        activeOpacity={0.2}
        style={styles.submitButton}
        onPress={() => props.navigation.navigate("TabNavigator")}
      >
        <Text style={styles.submitText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Dont have an account?
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("Signup")}
          >
            <Text style={styles.signup}> Sign up now</Text>
          </TouchableWithoutFeedback>
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    userEmail: state.loginCredentials.userEmail || "",
    userPassword: state.loginCredentials.userPassword || ""
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeEmailInput: email => dispatch({ type: "SET_EMAIL", email }),
    changePasswordInput: password =>
      dispatch({ type: "SET_PASSWORD", password })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: 23,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
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
  logo: {
    width: 120,
    height: 100
  },
  inputBox: {
    margin: 20,
    width: "80%"
  },
  signupContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  signupText: {
    color: "#7a42f4"
  },
  signup: {
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "white"
  }
});
