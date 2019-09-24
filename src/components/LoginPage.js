import React from "react";
import { StyleSheet, View, Image } from "react-native";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.logo} source={require("../images/findining.png")} />
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#1d2c38",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 120,
    height: 100
  }
});

export default LoginPage;
