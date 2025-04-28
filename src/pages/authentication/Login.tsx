import React, { ChangeEvent, useState } from "react";
import "../../styles/login.css";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Teachers from "../../assets/Teacher.jpg";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import { useAppContext } from "../../contexts/AppContext";
import { IconEye, IconViewOff } from "../../assets/svgs";
import Select from "../../components/common/Select/Select";
import { countryCodes } from "../../static/data";

const initialState = {
  username: "",
  password: "",
  country_code: "+91",
};

const LoginScreen: React.FC = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleIsLoggedIn } = useAppContext();
  const [passwordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSelectChange = (value: string) => {
    setData((prevState) => {
      return {
        ...prevState,
        country_code: value,
      };
    });
  };

  const onSubmit = () => {
    localStorage.clear();
    setIsLoading(true);
    Fetch(
      "login/",
      {
        phone_number_or_email: data.username,
        phone_number_prefix: data.country_code,
        password: data.password,
      },
      { method: "post" }
    ).then((res: any) => {
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
    values: {
      email: data.username,
      password: data.password,
      country_code: data.country_code,
    },
    onSubmit,
  });

  return (
    <div className="login-container">
      <div className="login-form-container flex-center">
        <div className="login-box shadow">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-3 title text-center">School Management System</h2>
            <h2 className="login-title mb-2">Sign In</h2>
            <p className="login-desc mb-4">Enter your email to sign in</p>

            <Select
              options={countryCodes}
              value={data.country_code}
              onChange={(value: string) => handleSelectChange(value)}
              label="Select country code"
              searchable={true}
            />

            <Input
              label="Email*"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Please enter your email"
              error={errors?.email}
            />

            <Input
              label="Password*"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Please enter your password"
              type={!passwordVisible ? "password" : "text"}
              error={errors?.password}
              iconRight={!passwordVisible ? <IconEye /> : <IconViewOff />}
              handleIconButtonClick={() =>
                setIsPasswordVisible((prevState) => !prevState)
              }
            />

            {errors?.non_field_errors && (
              <p className="error">{errors?.non_field_errors}</p>
            )}

            {errors?.unauthorized && (
              <p className="error">{errors?.unauthorized}</p>
            )}

            {errors?.internalServerError && (
              <p className="error">{errors?.internalServerError}</p>
            )}

            <Button
              text="Sign In"
              onClick={handleSubmit}
              className="mt-2 w-100"
              isLoading={isLoading}
              buttonType="submit"
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
