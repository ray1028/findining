// NavigationService.js

import { NavigationActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params, action) {
  setTimeout(() => {
    _navigator.dispatch(NavigationActions.navigate({
      routeName,
      params,
      action
    }));
  }, 400);
}

function goBack(...params) {
  setTimeout(() => {
    _navigator.goBack(...params);
  }, 400);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack
};
