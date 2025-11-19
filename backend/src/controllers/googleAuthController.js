const { fetchToken } = require("@/utils/getToken");
const { fetchUserInfo } = require("@/utils/fetchInfo");
const { getUserByEmail, createUser } = require('@/services/userService');
const { GenerateToken } = require('@/utils/generateToken');

const GoogleAuth = async(req,res) => {

    const options = {
        redirect_uri: process.env.BACKEND_URL + process.env.REDIRECT_PATH,
        client_id:
        process.env.CLIENT_ID,
        scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        response_type: "code",
        access_type: "offline",
  };

  console.log(options.redirect_uri);
  
  const authUrl = `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(options).toString()}`;
  res.redirect(authUrl);

}


const GoogleAuthCallback = async (req, res) => {

    const code = req.query.code;
    const error = req.query.error;

    if (error) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`)
    }

    console.log(code);
    const data = await fetchToken(code);
    const userInfo = await fetchUserInfo(data.access_token);

    let user = await getUserByEmail(userInfo.email);

    if (!user) {
        user = await createUser({
            name: userInfo.name,
            email: userInfo.email,
            password: null,
            provider: 'google',
            providerId: userInfo.id
        });
    }

    const token = GenerateToken({ id: user.id , email : user.email , name : user.name });
    res.cookie('token', token, { 
        httpOnly: true,
        secure: true,
        sameSite: 'Strict' , 
        maxAge: 10 * 60 * 60 * 1000 
    });

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?isLoggedIn=true`);      

}

module.exports = { GoogleAuth , GoogleAuthCallback };