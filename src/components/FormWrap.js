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
    backgroundColor: "#3D2B3D",
    // backgroundColor: "#7a42f4",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default FormWrap;
