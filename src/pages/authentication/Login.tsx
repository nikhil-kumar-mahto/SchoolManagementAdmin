import React, { ChangeEvent, useState } from "react";
import "../../styles/login.css";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Teachers from "../../assets/Teacher.jpg";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";

import { useAppContext } from "../../contexts/AppContext";

const initialState = {
  username: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleIsLoggedIn } = useAppContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onSubmit = () => {
    // localStorage.setItem("token", "access12345");
    // localStorage.setItem("refresh_token", "refresh12345");
    // toggleIsLoggedIn();
    localStorage.clear();
    setIsLoading(true);
    Fetch("login/", data, { method: "post" }).then((res: any) => {
      if (res.status) {
        const { access, refresh } = res.data;
        localStorage.setItem("token", access);
        localStorage.setItem("refresh_token", refresh);
        toggleIsLoggedIn();
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  const { errors, handleSubmit, handleNewError } = FormC({
    values: { email_or_phone: data.username, password: data.password },
    onSubmit,
  });

  return (
    <div className="login-container">
      <div className="login-form-container flex-center">
        <div className="login-box shadow">
          <form action="" onSubmit={handleSubmit}>
            <h2 className="mb-3 title text-center">School Management System</h2>
            <h2 className="login-title mb-2">Sign In</h2>
            <p className="login-desc mb-4">
              Enter your email to sign in
            </p>

            <Input
              label="Email*"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Please enter your email or phone number"
              error={errors?.email_or_phone}
            />

            <Input
              label="Password*"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Please enter your password"
              type="password"
              error={errors?.password}
            />

            {errors?.non_field_errors && (
              <p className="error">{errors?.non_field_errors}</p>
            )}

            <Button
              text="Sign In"
              onClick={handleSubmit}
              className="mt-2 w-100"
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
      <div className="img-container flex-center m-3">
        <img src={Teachers} alt="Illustration" className="img" />
      </div>
    </div>
  );
};

export default LoginScreen;
