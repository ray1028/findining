import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const Home = props => {
  return (
    <View style={styles.homeContainer}>
      <Text>home page</Text>
      <Button
        title="LOGIN"
        onPress={() => props.navigation.navigate("SignIn")}
      />
      <Button
        title="SIGNUP"
        onPress={() => props.navigation.navigate("SignOut")}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
