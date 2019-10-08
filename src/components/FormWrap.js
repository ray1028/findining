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
    backgroundColor: "#58B09C",
    // backgroundColor: "#7a42f4",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default FormWrap;
