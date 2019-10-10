import React, { useEffect } from "react";
import { connect } from "react-redux";
import { FlatList, Text, View, Alert, TouchableOpacity } from "react-native";
import { Image, ListItem, Badge } from "react-native-elements";

const desc = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
];

const images = {
  burger: [
    "https://b.zmtcdn.com/data/reviews_photos/e67/c046885fc6431cd395a7214179637e67.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A"
  ],
  sandwich: [
    "https://b.zmtcdn.com/data/reviews_photos/03a/23f47131f6d494ce0854b25d9145103a_1565997520.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A"
  ],
  wrap: [
    "https://i.pinimg.com/236x/bf/2e/50/bf2e506e890bab3829221b86c65f6d34.jpg"
  ],
  poutine: [
    "https://b.zmtcdn.com/data/reviews_photos/23d/107c524ad831597fe5c38e36cd18223d.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A"
  ],
  fish_and_chips: [
    "https://i.pinimg.com/236x/3b/ef/58/3bef58f20428e39ef358f5af0372dab8.jpg"
  ],
  onion_rings: [
    "https://i.pinimg.com/474x/ac/f7/11/acf711c88aa144e1a17558f210a5a4e5--the-nest-side-recipes.jpg"
  ],
  fries: [
    "https://photos.bigoven.com/recipe/hero/all-star-french-fries-dd49eb.jpg?h=500&w=500"
  ]
};

const restaurant = {
  name: "Scotland Yard",
  // averageCostPerPerson: 33.25,
  // averageCostPerPint: 6.19,
  // accepts: ["CASH", "CREDIT", "DEBIT"],
  open: "10am",
  closed: "2pm",
  menu: [
    { name: "Turkey Club", desc: desc[0], type: "sandwich" },
    { name: "Onion Rings", desc: desc[0], type: "onion_rings" },
    { name: "Fish 'N' Chips", desc: desc[0], type: "fish_and_chips" },
    { name: "Yard Poutine", desc: desc[1], type: "poutine" },
    { name: "Cajun Chicken Wrap", desc: desc[2], type: "wrap" },
    { name: "Spicy Burger", desc: desc[0], type: "burger" },
    { name: "Pulled Pork Sandwhich", desc: desc[1], type: "sandwich" },
    { name: "Nove Sandwich", desc: desc[0], type: "sandwich" },
    { name: "Sweet Potato Fries", desc: desc[2], type: "fries" },
    { name: "Yard Cheeseburger", desc: desc[1], type: "burger" },
    { name: "Cardiac Burger", desc: desc[2], type: "burger" },
    { name: "Triple B Burger", desc: desc[1], type: "burger" },
    { name: "Veggie Burger", desc: desc[2], type: "burger" }
  ]
};

const getTypeImage = type => images[type][0];

const mapStateToProps = ({ eventDetail }) => eventDetail;
const mapDispatchToProps = dispatch => ({});
const MenuScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ restaurant }) => {
  if (!restaurant) {
    return <View />; //@TODO Loading screen
  }
  return (
    <View>
      <View
        style={{
          borderBottomColor: "silver",
          borderBottomWidth: 4,
          padding: 10
        }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 15
          }}
        >
          {restaurant.name}
        </Text>
        <Text
          style={{ fontSize: 12, fontStyle: "italic", textAlign: "center" }}
        >
          {restaurant.open} - {restaurant.closed}
        </Text>
      </View>
      <FlatList
        style={{ paddingTop: 10 }}
        data={restaurant.menuItems}
        keyExtractor={(item, i) => i}
        renderItem={({ item }) => {
          return (
            <ListItem
              leftAvatar={{
                rounded: true,
                source: { uri: item["image_uri"] },
                size: "large"
              }}
              title={item.name}
              subtitle={item.description}
              bottomDivider={true}
              badge={{ status: "primary" }}
            />
          );
        }}
      />
    </View>
  );
});

// const mapStateToProps = ({ restaurantMenu }) => restaurantMenu;

// const mapDispatchToProps = dispatch => ({
//   dispatchSetRestaurant: id =>
//     dispatch({ type: "ACTION_RESTAURANT", value: id }),
//   dispatchSetMenuItem: id => dispatch({ type: "ACTION_MENU_ITEMS", value: id })
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(MenuScreen);

export default MenuScreen;
