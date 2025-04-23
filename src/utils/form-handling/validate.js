import moment from "moment";
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
  if (
    evt.key === "Backspace" ||
    evt.key === "Tab" ||
    evt.key === "ArrowLeft" ||
    evt.key === "ArrowRight" ||
    evt.key === "Delete"
  ) {
    return;
  }

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

  if (property.includes("website") && data[property]?.length) {
    const regex = /^(http|https):\/\/[^ "]+$/;
    if (!regex.test(data[property])) {
      errors[property] = "Please enter valid website URL.";
    }
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

  const handleDateTimeSlots = (values, isSubmit = false) => {
    if (isSubmit) {
      removeAllError()
    }
    console.log("values==>", values);

    let errors = { ...err }

    // Initial step -> check for items present outside of array
    if (!values.school && isSubmit) {
      errors.school = "Please select school."
    } else if (errors?.school && values.school) {
      delete errors.school
    }
    if (!values.class && isSubmit) {
      errors.class = "Please select class."
    } else if (errors?.class && values.class) {
      delete errors.class
    }
    if (!values.date && isSubmit) {
      errors.date = "Please select date."
    } else if (errors?.date && values.date) {
      delete errors.date
    }

    const schedule = values.schedule
    errors.schedule = errors?.schedule || []

    // check for array
    for (let i = 0; i < schedule.length; i++) {
      errors.schedule.push({})
      if (!schedule[i].start_time && isSubmit) {
        errors["schedule"][i].start_time = "Please select start time."
      } else if (errors?.["schedule"]?.[i]?.start_time && schedule[i].start_time) {
        delete errors?.["schedule"]?.[i]?.start_time
      }

      if (!schedule[i].end_time && isSubmit) {
        errors["schedule"][i].end_time = "Please select end time."
      } else if (errors?.["schedule"]?.[i]?.end_time && schedule[i].end_time) {
        delete errors?.["schedule"]?.[i]?.end_time
      }

      if (!schedule[i].teacher && isSubmit) {
        errors["schedule"][i].teacher = "Please select teacher."
      } else if (errors?.["schedule"]?.[i]?.teacher && schedule[i].teacher) {
        delete errors?.["schedule"]?.[i]?.teacher
      }

      if (!schedule[i].subject && isSubmit) {
        errors["schedule"][i].subject = "Please select subject."
      } else if (errors?.["schedule"]?.[i]?.subject && schedule[i].subject) {
        delete errors?.["schedule"]?.[i]?.subject
      }
    }

    // check for consecutive elements in array, that stores time slots
    for (let i = 0; i < values.schedule.length; i++) {
      const slot1Start = moment(values.schedule[i].start_time, "HH:mm")
      const slot1End = moment(values.schedule[i].end_time, "HH:mm")

      if (slot1End.isBefore(slot1Start) || slot1End.isSame(slot1Start)) {
        errors["schedule"][i].start_time = "Start time must be before end time."
      }

      if (i === values.schedule.length - 1) {
        break;
      }

      const slot2Start = moment(values.schedule[i + 1].start_time, "HH:mm")
      const slot2End = moment(values.schedule[i + 1].end_time, "HH:mm")

      if (slot1End.isAfter(slot2Start)) {
        errors.schedule[i].end_time = "Time slot overlaps with another entry.";
        errors.schedule[i + 1].start_time = "Time slot overlaps with another entry.";
      }

    }

    // Loop through all schedule object and check if any error is present, if not remove that object.
    let errorPresent = false
    for (let i = 0; i < errors.schedule.length; i++) {
      if (Object.keys(errors.schedule[i]).length > 0) {
        errorPresent = true
        break;
      }
    }

    // remove schedule key when no object present
    if (!errorPresent) {
      delete errors.schedule
    }

    setErr(errors)

    if (Object.keys(errors).length === 0 && isSubmit) {
      onSubmit()
    }
  }

  const handleWeekTimeSlots = (values, isSubmit = false) => {
    if (isSubmit) {
      removeAllError()
    }
    let errors = { ...err }

    // Initial step -> check for items present outside of array
    if (!values.school && isSubmit) {
      errors.school = "Please select school."
    } else if (errors?.school && values.school) {
      delete errors.school
    }
    if (!values.class && isSubmit) {
      errors.class = "Please select class."
    } else if (errors?.class && values.class) {
      delete errors.class
    }

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    errors.schedule = {};

    for (let day of weekDays) {
      errors.schedule[day] = errors.schedule[day] || [];

      if (!values[day] || !Array.isArray(values[day]) || values[day].length === 0) {
        if (isSubmit) {
          // errors.schedule[day] = [{ error: "Please provide schedule data for " + day }];
        }
        continue;
      }

      const schedule = values[day];

      // check for array
      for (let i = 0; i < schedule.length; i++) {
        errors.schedule[day].push({});
        if (!schedule[i].start_time && isSubmit) {
          errors.schedule[day][i].start_time = "Please select start time.";
        } else if (errors?.schedule?.[day]?.[i]?.start_time && schedule[i].start_time) {
          delete errors.schedule[day][i].start_time;
        }

        if (!schedule[i].end_time && isSubmit) {
          errors.schedule[day][i].end_time = "Please select end time.";
        } else if (errors?.schedule?.[day]?.[i]?.end_time && schedule[i].end_time) {
          delete errors.schedule[day][i].end_time;
        }

        if (!schedule[i].teacher && isSubmit) {
          errors.schedule[day][i].teacher = "Please select teacher.";
        } else if (errors?.schedule?.[day]?.[i]?.teacher && schedule[i].teacher) {
          delete errors.schedule[day][i].teacher;
        }

        if (!schedule[i].subject && isSubmit) {
          errors.schedule[day][i].subject = "Please select subject.";
        } else if (errors?.schedule?.[day]?.[i]?.subject && schedule[i].subject) {
          delete errors.schedule[day][i].subject;
        }
      }

      // check for consecutive elements in array, that stores time slots
      for (let i = 0; i < schedule.length; i++) {
        const slot1Start = moment(schedule[i].start_time, "HH:mm");
        const slot1End = moment(schedule[i].end_time, "HH:mm");

        if (slot1End.isBefore(slot1Start) || slot1End.isSame(slot1Start)) {
          errors.schedule[day][i].start_time = "Start time must be before end time.";
        }

        if (i === schedule.length - 1) {
          break;
        }

        const slot2Start = moment(schedule[i + 1].start_time, "HH:mm");
        const slot2End = moment(schedule[i + 1].end_time, "HH:mm");

        if (slot1End.isAfter(slot2Start)) {
          errors.schedule[day][i].end_time = "Time slot overlaps with another entry.";
          errors.schedule[day][i + 1].start_time = "Time slot overlaps with another entry.";
        }
      }

      // Loop through all schedule object and check if any error is present, if not remove that object.
      let errorPresent = false;
      for (let i = 0; i < errors.schedule[day].length; i++) {
        if (Object.keys(errors.schedule[day][i]).length > 0) {
          errorPresent = true;
          break;
        }
      }

      // remove schedule key when no object present for the day
      if (!errorPresent) {
        delete errors.schedule[day];
      }
    }

    // remove schedule key when no errors are present for any day
    if (Object.keys(errors.schedule).length === 0) {
      delete errors.schedule;
    }

    setErr(errors);

    if (Object.values(errors.schedule).every(item => item.length === 0) && isSubmit && !errors.school && !errors.class) {
      onSubmit();
    }
  }

  const obj = {
    handleBlur,
    removeFormValidation,
    handleChange,
    handleSubmit,
    handleNewError,
    handleArrayChange,
    removeAllError,
    handleDateTimeSlots,
    handleWeekTimeSlots,
    errors: err,
  };
  return obj;
};
