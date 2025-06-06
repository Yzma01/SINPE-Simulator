process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export const makeFetch = async (url, method, params, body) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const apiURL = `${baseUrl + url}${
      params !== "" || params === undefined? "/" + params : ""
    }`;
    console.log("hika" , baseUrl)
    
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