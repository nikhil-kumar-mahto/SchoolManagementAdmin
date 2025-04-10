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
