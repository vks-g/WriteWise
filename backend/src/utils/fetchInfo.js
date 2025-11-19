const fetchUserInfo = async (token) => {

  const response = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
  
}

module.exports = { fetchUserInfo };