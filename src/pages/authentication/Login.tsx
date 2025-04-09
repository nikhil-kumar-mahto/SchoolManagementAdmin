import React, { ChangeEvent, useState } from "react";
import "../../styles/login.css";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Teachers from "../../assets/Teacher.jpg";

const initialState = {
  userName: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [data, setData] = useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onSubmit = () => {};

  return (
    <div className="login-container">
      <div className="login-form-container flex-center">
        <div className="login-box shadow">
          <h2 className="mb-3 title text-center">School Management System</h2>
          <h2 className="login-title mb-1">Sign In</h2>
          <p className="login-desc mb-4">
            Enter your email and password to sign in
          </p>
          <Input
            label="Phone Number / Email"
            name="userName"
            value={data.userName}
            onChange={handleChange}
            placeholder="Please provide phone number or email"
          />

          <Input
            label="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Please enter your password"
            type="password"
          />

          <Button text="Sign In" onClick={onSubmit} className="mt-2 w-100" />
        </div>
      </div>
      <div className="img-container flex-center m-3">
        <img src={Teachers} alt="Illustration" className="img" />
      </div>
    </div>
  );
};

export default LoginScreen;
