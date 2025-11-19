const fetchToken = async (code) => {

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri:  `http://localhost:${process.env.PORT}` + process.env.REDIRECT_PATH,
      grant_type: "authorization_code"
    }).toString()
  });
  const data = await response.json();
  console.log(data);
  return data;
  
}

module.exports = { fetchToken };