import React from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import FormWrap from "./FormWrap";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";

const user = {};
const Signup = ({ dispatchSignupCredentials, currentUser, navigation }) => {
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
        onChangeText={text => (user.name = text)}
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
        onChangeText={text => (user.email = text)}
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
        onChangeText={text => (user.password = text)}
      />
      <Button
        title="Signup Now"
        type="clear"
        icon={<Icon name="plus" size={15} color="white" />}
        style={styles.signupButton}
        onPress={() => {
          dispatchSignupCredentials(user);
          console.log("current user is " + JSON.stringify(currentUser));
          // currentUser && navigation.navigate("MainNavigator");
          currentUser && navigation.navigate("Profile");
        }}
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

const mapStateToProps = ({ signupNewUser }) => signupNewUser;

const mapDispatchToProps = dispatch => {
  return {
    dispatchSignupCredentials: user => {
      dispatch({
        type: "ACTION_SIGNUP_CREDENTIALS",
        value: user
      });
      // navigation.navigate("Profile");
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
