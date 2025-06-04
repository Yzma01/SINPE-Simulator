process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export const serverFetch = async (url, method, params, body) => {
    const apiURL = `${url}${
      params !== "" || params === undefined? "/" + params : ""
    }`;
    
  const response = await fetch(apiURL, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "default",
  });
  return response;
};