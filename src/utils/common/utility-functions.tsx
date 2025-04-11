import moment from "moment";

export function getIdFromUrl(url: any) {
  if (!url) {
    return false;
  }

  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];

  if (!isNaN(lastPart)) {
    return lastPart;
  }

  const queryParams = url.split("?")[1];
  if (queryParams) {
    const params = queryParams.split("&");
    for (const param of params) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }

  const idMatch = url.match(/\/(\d+)(?:[^\d]|$)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  return false;
}

export function generateTimeArray() {
  const timeArray = [];

  for (let hour = 0; hour < 24; hour++) {
    const time = moment({ hour });
    timeArray.push({
      value: time.format("HH:mm"),
      label: time.format("hh:mm A"),
    });
  }

  console.log("time aray===", timeArray);

  return timeArray;
}

export function filterTimeArray(startTime) {
  if (startTime === "23:00") {
    return [{ value: "00:00", label: "12:00 AM" }];
  }

  const timeArray = generateTimeArray();
  if (!startTime) {
    return timeArray;
  }

  let startHour;
  if (typeof startTime === "string") {
    const parsedTime = moment(startTime, "HH:mm", true);
    if (parsedTime.isValid()) {
      startHour = parsedTime.hour();
    } else {
      throw new Error("Invalid time format. Please use 'HH:mm' format.");
    }
  } else if (typeof startTime === "number") {
    startHour = startTime;
  } else {
    throw new Error(
      "Invalid input type. Please provide a number or a string in 'HH:mm' format."
    );
  }

  return timeArray.filter((time) => {
    const hour = parseInt(time.value.split(":")[0], 10);
    return hour > startHour;
  });
}
