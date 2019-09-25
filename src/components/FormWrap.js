import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";

const FormWrap = props => {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.mainContainer}>
      {props.children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#1d2c38",
    // backgroundColor: "#7a42f4",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default FormWrap;
