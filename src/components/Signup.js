import React from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import FormWrap from "./FormWrap";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";

let userName = "";
let userEmail = "";
let userPassword = "";

const Signup = props => {
  return (
    <FormWrap style={styles.signupContainer}>
      <Icon name="user-plus" color="white" size={60} style={styles.icon} />
      <Input
        placeholder="Name"
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        leftIcon={
          <Icon
            name="user"
            size={24}
            color="white"
            style={styles.inputBox}
            errorMessage="ENTER A VALID ERROR HERE"
          />
        }
        // onChangeText={props.changeUserName}
        onChangeText={text => (userName = text)}
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
        // onChangeText={props.changeEmailInput}
        onChangeText={text => (userEmail = text)}
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
        // onChangeText={props.changePasswordInput}
        onChangeText={text => (userPassword = text)}
      />
      <Button
        title="Signup Now"
        type="clear"
        icon={<Icon name="plus" size={15} color="white" />}
        style={styles.signupButton}
        onPress={() =>
          props.dispatchSignupCredentials(userName, userPassword, userEmail)
        }
      />
    </FormWrap>
  );
};
const styles = StyleSheet.create({
  signupContainer: {
    paddingTop: 23,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginBottom: 30
  },
  inputBox: {
    margin: 20,
    width: "80%"
  },
  signupButton: {
    borderColor: "#7a42f4",
    color: "white"
  }
});

const mapStateToProps = state => {
  return {
    userName: state.signupNewUser.userName || "",
    userEmail: state.signupNewUser.userEmail || "",
    userPassword: state.signupNewUser.userPassword || ""
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSignupCredentials: (userName, userEmail, userPassword) => {
      dispatch({
        type: "SET_SIGNUP_CREDENTIALS",
        userName,
        userEmail,
        userPassword
      });
      // navigation.navigate("Profile");
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
