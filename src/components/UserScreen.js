import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
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

const userInterests = [
  {
    id: 1,
    key: "finance",
    name: "finance",
    type: "material-community"
  },
  {
    id: 2,
    key: "sports",
    name: "soccer-ball-o",
    type: "font-awesome"
  },
  {
    id: 3,
    key: "date",
    name: "heart-o",
    type: "font-awesome"
  },
  {
    id: 4,
    key: "tech",
    name: "code",
    type: "entypo"
  },
  {
    id: 5,
    key: "art",
    name: "paint-brush",
    type: "font-awesome"
  },
  {
    id: 6,
    key: "health",
    name: "food-variant",
    type: "material-community"
  },
  {
    id: 7,
    key: "music",
    name: "music",
    type: "font-awesome"
  },
  {
    id: 8,
    key: "travel",
    name: "plane",
    type: "font-awesome"
  },
  {
    id: 9,
    key: "book",
    name: "book",
    type: "font-awesome"
  },
  {
    id: 10,
    key: "gym",
    name: "dumbbell",
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
    justifyContent: "flex-start",
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
const mapDispatchToProps = dispatch => ({});
const UserScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ user }) => {
  if (!user) {
    return (<View />);
  }
  return (
    <View style={styles.profileContainer}>
      <View style={styles.topContainer}>
        <View>
          <Avatar rounded source={{ uri: user.profile_uri }} size={130} />
          <Badge
            status="success"
            containerStyle={{ position: "absolute", top: 5, right: 40 }}
          />
          <View
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text h2>{user.name}</Text>
            {user.gender === "female" ? (
              <Icon type="font-awesome" name="female" color="red" size={20} />
            ) : (
              <Icon type="font-awesome" name="male" color="blue" size={20} />
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.interestContainer}>
          {user.interests.map(interest => {
            return (
              <View key={interest.id} style={styles.iconContainer}>
                <Tooltip
                  popover={<Text>{interest.name}</Text>}
                  withOverlay={false}
                >
                  <Icon
                    type={userInterests.find(k => k.id === interest.id).type}
                    name={userInterests.find(k => k.id === interest.id).name}
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
