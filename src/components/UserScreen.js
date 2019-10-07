import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import {
  Icon,
  Avatar,
  withBadge,
  Button,
  Text,
  Badge,
  Tooltip
} from "react-native-elements";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";

const BadgedIcon = withBadge(
  <Icon
    type="font-awesome"
    name="camera"
    containerStyle={{
      backgroundColor: "lightblue",
      width: 50,
      borderRadius: 50,
      borderStyle: "solid",
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center"
    }}
  />,
  { top: 3, right: -10 }
)(Avatar);

const username = "Ray J";
const userInterests = [
  {
    key: "finance",
    name: "finance",
    type: "material-community"
  },
  {
    key: "sports",
    name: "soccer-ball-o",
    type: "font-awesome"
  },
  {
    key: "date",
    name: "heart-o",
    type: "font-awesome"
  },
  {
    key: "tech",
    name: "code",
    type: "entypo"
  },
  {
    key: "art",
    name: "paint-brush",
    type: "font-awesome"
  },
  {
    key: "health",
    name: "food-variant",
    type: "material-community"
  }
];
const userGender = "male";

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1
  },
  topContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  bottomContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A445D"
  },
  interestContainer: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 15
  },
  iconContainer: {
    borderColor: "orange",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 50,
    padding: 12,
    margin: 3
  }
});

const mapStateToProps = ({ eventDetail }) => eventDetail;
const mapDispatchToProps = (dispatch) => ({});
const UserScreen = connect(mapStateToProps, mapDispatchToProps)
  (({ user }) => {
    console.log(user);
    return (
      <View style={styles.profileContainer}>
        <View style={styles.topContainer}>
          <View>
            <Avatar
              rounded
              source={require("../assets/images/ray.png")}
              size={170}
            />
            <Badge
              status="success"
              containerStyle={{ position: "absolute", top: -4, right: -4 }}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text h1>{username}</Text>
          <Text h1>{userGender}</Text>
          <View style={styles.interestContainer}>
            {userInterests.map(interest => {
              return (
                <View key={interest.key} style={styles.iconContainer}>
                  <Tooltip
                    popover={<Text>{interest.key}</Text>}
                    withOverlay={false}
                  >
                    <Icon
                      type={interest.type}
                      name={interest.name}
                      iconStyle={{
                        color: "orange"
                      }}
                      size={35}
                      underlayColor="blue"
                    />
                  </Tooltip>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  });

  export default UserScreen;
