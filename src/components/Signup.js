import React from "react";
import { StyleSheet } from "react-native";
import FormWrap from "./FormWrap";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";

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
        onChangeText={props.changeUserName}
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
      <Button
        title="Signup Now"
        type="clear"
        icon={<Icon name="plus" size={15} color="white" />}
        style={styles.signupButton}
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
    changeUsernameInput: username =>
      dispatch({ type: "SET_USERNAME", username }),
    changeEmailInput: email => dispatch({ type: "SET_EMAIL", email }),
    changePasswordInput: password =>
      dispatch({ type: "SET_PASSWORD", password })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
