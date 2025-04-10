import React, { ChangeEvent, useState } from "react";
import "../../styles/login.css";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Teachers from "../../assets/Teacher.jpg";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";

import { useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    Fetch("apiurl", data, { method: "post" }).then((res: any) => {
      if (res.status) {
        const { access } = res.data;
        localStorage.setItem("token", access);
        navigate("/dashboards");
      } else {
        // let resErr = arrayString(res);
        // handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  const { errors, handleSubmit, handleNewError } = FormC({
    values: data,
    onSubmit,
  });

  return (
    <div className="login-container">
      <div className="login-form-container flex-center">
        <div className="login-box shadow">
          <form action="" onSubmit={handleSubmit}>
            <h2 className="mb-3 title text-center">School Management System</h2>
            <h2 className="login-title mb-1">Sign In</h2>
            <p className="login-desc mb-4">
              Enter your email and password to sign in
            </p>

            <Input
              label="Email / Number"
              name="userName"
              value={data.userName}
              onChange={handleChange}
              placeholder="Please enter your email or phone number"
              error={errors?.userName}
            />

            <Input
              label="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Please enter your password"
              type="password"
              error={errors?.password}
            />

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
