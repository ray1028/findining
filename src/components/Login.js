import React from "react";
import LoginForm from "./LoginForm";
import FormWrap from "./FormWrap";

const LoginPage = props => {
  return (
    <FormWrap>
      <LoginForm navigation={props.navigation} />
    </FormWrap>
  );
};

export default LoginPage;
