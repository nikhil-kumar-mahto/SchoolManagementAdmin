/* eslint-disable */
// @ts-nocheck

import { useState, useEffect } from "react";

interface ValidationError {
  [key: string]: any;
}

interface Schedule {
  start_time?: string;
  end_time?: string;
  teacher?: string;
  subject?: string;
}

interface Values {
  [key: string]: any;
}

export const validation = (data: Values, selectFields: string[] = []): ValidationError => {
  let errors: ValidationError = {};
  for (const property in data) {
    if (!data[property]?.length && Array.isArray(data[property])) {
      const isSelectField = selectFields.includes(property);
      errors[property] = `Please ${isSelectField ? "select" : "enter"} ${
        property?.split("_") ? property?.split("_").join(" ") + "." : property + "."
      }`;
    } else if (data[property]?.length && Array.isArray(data[property])) {
      let arrayErrors: ValidationError[] = [];
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

export const onKeyPress = (evt: React.KeyboardEvent<HTMLInputElement>, reg?: RegExp) => {
  if (
    evt.key === "Backspace" ||
    evt.key === "Tab" ||
    evt.key === "ArrowLeft" ||
    evt.key === "ArrowRight" ||
    evt.key === "Delete" ||
    evt.ctrlKey ||
    evt.metaKey
  ) {
    return;
  }

  const key = evt.key;
  const regex = reg ? reg : /^[0-9\b]+$/;
  if (!regex.test(key)) {
    evt.preventDefault();
  }
};

const inputValidation = (data: Values, property: string, selectFields: string[] = []): ValidationError => {
  const errors: ValidationError = {};
  if (data[property] === null || data[property] === undefined || !data[property].toString().trim().length) {
    errors[property] = `Please ${
      selectFields.includes(property)
        ? "select"
        : property.includes("photo") ||
          property.includes("logo") ||
          property.includes("file_passbook") ||
          property.includes("file_adhaar") ||
          property.includes("file_pancard") ||
          property.includes("form_11")
        ? "upload"
        : "enter"
    } ${
      property === "email"
        ? "email address."
        : property.replace(/_/g, " ") + "."
    }`;
  }

  if (property.includes("website") && data[property]?.trim().length) {
    const regex = /^(http|https):\/\/[^ "]+$/;
    if (!regex.test(data[property])) {
      errors[property] = "Please enter valid website URL.";
    }
  }

  if (property.includes("email") && data[property]?.trim().length) {
    if (ValidateEmailAddress(data[property])) {
      errors[property] = ValidateEmailAddress(data[property]);
    }
  }
  if (property.includes("phone") && data[property]?.trim().length) {
    if (data[property]?.length < 10) {
      errors[property] = "Phone number must have at least 10 digits.";
    }
  }
  if (property.includes("delivery_number") && data[property]?.length) {
    if (data[property]?.length != 8) {
      errors[property] = "Phone number must have exactly 8 digits.";
    }
  }
  if ((property === "password" || property === "new_password") && data[property].trim().length) {
    if (passwordCheck(data[property])) {
      errors[property] = passwordCheck(data[property]);
    }
  }
  if (property === "confirm_password" && data["confirm_password"]?.trim().length) {
    if (data["confirm_password"] !== data["password"]) {
      errors["confirm_password"] = "Password does not match. Please make sure they match.";
    } else {
      delete errors["confirm_password"];
    }
  }
  if (property === "confirm_new_password" && data["confirm_password"]?.trim().length) {
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

export const passwordCheck = (password: string): string | undefined => {
  if (password.length < 8) return "Password must have minimum of 8 characters.";
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
  if (!regex.test(password))
    return "Password must include at least 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.";
};

export const ValidateEmailAddress = (emailString: string): string | undefined => {
  if (!emailString) return "Please enter email";
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(emailString)) return "Your email is incorrect. Please try again";
};

export const FormC = ({
  values,
  removeValidValue,
  onSubmit,
  onSubmitError,
  selectFields = [],
}: {
  values: Values;
  onSubmit: (e?: React.FormEvent) => void;
  onSubmitError?: (errors: ValidationError) => void;
  selectFields?: string[];
}) => {
  const [err, setErr] = useState<ValidationError>({});
  const [stateParam, setStateParam] = useState<Values>({ ...values });

  useEffect(() => {
    if (values && JSON.stringify(values) !== JSON.stringify(stateParam)) {
      setStateParam(values);
    }
  }, [values]);

  const removeAllError = () => {
    setErr({});
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const data = removeFormValidation(stateParam);
    const error = validation(data, selectFields);

    setErr(error);
    if (!Object.keys(error).length) {
      setErr({});
      onSubmit(e);
    } else {
      onSubmitError && onSubmitError(error);
      const errKeys = Object.keys(error);
      if (errKeys.length) {
        const input =
          document.querySelector(`input[name=${errKeys[0]}]`) ||
          document.querySelector(`select[name=${errKeys[0]}]`);

        input?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  };

  const handleNewError = (error: ValidationError) => {
    if (Object.keys(error)?.length) {
      const firstKey = Object.keys(error)[0];
      const input =
        document.querySelector(`input[name=${firstKey}]`) ||
        document.querySelector(`select[name=${firstKey}]`);
      input?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
    setErr({ ...error });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const state = {
      ...stateParam,
      [name]: value,
    };
    setStateParam(state);
    if (value?.length) {
      const data = removeFormValidation({ [name]: value });
      if (!Object.keys(data)?.length) {
        let error = validation(state);
        setErr(error);
      }
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target || {};
    let state = {
      [name]: value,
    };
    const data = removeFormValidation({ [name]: value });
    if (Object.keys(data)?.length) {
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

  const removeFormValidation = (stateUpdate: Values) => {
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