import { useState, useEffect } from "react";
export const validation = (data, selectFields = []) => {
  let errors = {};
  for (const property in data) {
    if (!data[property]?.length && Array.isArray(data[property])) {
      const isSelectField = selectFields.includes(property);
      errors[property] = `Please ${isSelectField ? "select" : "enter"} ${property?.split("_") ? property?.split("_").join(" ") + "." : property + "."
        }`;
    } else if (data[property]?.length && Array.isArray(data[property])) {
      let arrayErrors = [];
      let index = 0;
      for (const propertyArray of data[property]) {
        const arrayError = validation(propertyArray, selectFields);
        index++;
        if (Object.keys(arrayError)?.length) {
          for (let i = 0; i < index - 1; i++) {
            arrayErrors.push({});
          }
          index = 0;
          arrayErrors.push(arrayError);
        }
      }

      if (arrayErrors.length > 0) {
        errors[property] = arrayErrors;
      }
    } else if (typeof data[property] === "object") {
      const objectErrors = validation(data[property], selectFields);
      if (Object.keys(objectErrors)?.length) {
        errors[property] = objectErrors;
      }
    } else {
      errors = {
        ...errors,
        ...inputValidation(data, property, selectFields),
      };
    }
  }
  return errors;
};

export const onKeyPress = (evt, reg) => {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode(key);
  var regex = reg ? reg : /^[0-9\b]+$/;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
};
const inputValidation = (data, property, selectFields = []) => {
  const errors = {};
  if (data[property] === null || data[property] === undefined || !data[property].toString().length) {
    errors[property] = `Please ${selectFields.includes(property) ? "select" : property.includes("photo") || property.includes("logo") || property.includes("file_passbook") || property.includes("file_adhaar") || property.includes("file_pancard") || property.includes("form_11") ? "upload" : "enter"} ${property === "email"
      ? "email address."
      : property.replace(/_/g, " ") + "."
      }`;
  }

  if (property.includes("email") && data[property]?.length) {
    if (ValidateEmailAddress(data[property])) {
      errors[property] = ValidateEmailAddress(data[property]);
    }
  }
  if (property.includes("phone") && data[property]?.length) {
    if (data[property]?.length < 10) {
      errors[property] = "Phone number must have at least 10 digits.";
    }
  }
  if (property.includes("delivery_number") && data[property]?.length) {
    if (data[property]?.length != 8) {
      errors[property] = "Phone number must have exactly 8 digits.";
    }
  }
  if ((property === "password" || property === "new_password") && data[property].length) {
    if (passwordCheck(data[property])) {
      errors[property] = passwordCheck(data[property]);
    }
  }
  if (property === "confirm_password" && data["confirm_password"]?.length) {
    if (data["confirm_password"] !== data["password"]) {
      errors["confirm_password"] = "Password does not match. Please make sure they match.";
    } else {
      delete errors["confirm_password"];
    }
  }
  if (property === "confirm_new_password" && data["confirm_password"]?.length) {
    if (data["confirm_new_password"] !== data["new_password"]) {
      errors["confirm_new_password"] = "Password does not match. Please make sure they match.";
    } else {
      delete errors["confirm_new_password"];
    }
  }
  if (property === "hr_email" && data[property]?.length) {
    if (ValidateEmailAddress(data[property])) {
      errors[property] = ValidateEmailAddress(data[property]);
    }
  }
  return errors;
};
export const passwordCheck = (password) => {
  if (password.length < 8) return "Password must have minimum of 8 characters.";
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
  if (!regex.test(password)) return "Your password is incorrect. Please try again";
};
export const ValidateEmailAddress = (emailString) => {
  if (!emailString) return "Please enter email";
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(emailString)) return "Your email is incorrect. Please try again";
};
export const FormC = ({ values, removeValidValue, onSubmit, onSubmitError, selectFields = [] }) => {
  const [err, setErr] = useState({});
  const [stateParam, setStateParam] = useState({ ...values });
  useEffect(() => {
    if ((values && JSON.stringify(values)) !== JSON.stringify(stateParam)) {
      setStateParam(values);
    }
  }, [values]);
  const removeAllError = () => {
    setErr({});
  };
  const handleSubmit = (e) => {
    e?.preventDefault();
    const data = removeFormValidation(stateParam);
    const error = validation(data, selectFields);
    setErr(error);
    if (!Object?.keys(error)?.length) {
      setErr({});
      onSubmit(e);
    } else {
      onSubmitError && onSubmitError(error);
      const err = Object.keys(error);
      if (err.length) {
        const input = document.querySelector(`input[name=${err[0]}]`);
        input?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  };
  const handleNewError = (error) => {
    setErr({ ...error });
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const state = {
      ...stateParam,
      [name]: value,
    };
    setStateParam(state);
    if (value?.length) {
      const data = removeFormValidation({ [name]: value });
      if (!Object?.keys(data)?.length) {
        let error = validation(state);
        setErr(error);
      }
    }
  };
  const handleArrayChange = (e, type) => {
    const { name, value } = e?.target || {};
    let state = {
      [name]: value,
    };
    if (value?.length) {
      let error = validation(state);
      setErr({
        [type]: [error],
      });
    } else {
      setErr({});
    }
  };
  const handleChange = (e) => {
    const { name, value } = e?.target || {};
    let state = {
      [name]: value,
    };
    const data = removeFormValidation({ [name]: value });
    if (Object?.keys(data)?.length) {
      if (value?.length) {
        var stateparam = {
          ...state,
        };
        if (name === "confirm_password") {
          stateparam = {
            ...stateparam,
            password: stateParam?.password,
          };
        }
        let error = validation(stateparam);
        setErr(error);
      } else {
        setErr({});
      }
    }
  };
  const removeFormValidation = (stateUpdate) => {
    let d = { ...stateUpdate };
    if (removeValidValue?.length) {
      for (let name in d) {
        if (removeValidValue?.includes(name)) {
          delete d[name];
        }
      }
    }
    return d;
  };
  const obj = {
    handleBlur,
    removeFormValidation,
    handleChange,
    handleSubmit,
    handleNewError,
    handleArrayChange,
    removeAllError,
    errors: err,
  };
  return obj;
};
