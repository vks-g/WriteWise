const { createUser, getUserByEmail } = require('@/services/userService');
const { GenerateToken } = require('@/utils/generateToken');
const bcrypt = require('bcrypt');

const Register = async (req, res) => {

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });
    const token = GenerateToken({ id: newUser.id , email , name });
    res.cookie('token', token, { 
        httpOnly: true,
        secure: true,
        sameSite: 'Strict' , 
        maxAge: 10 * 60 * 60 * 1000 
    });
    console.log('User registered:', newUser);
    res.status(201).json({ success: true, user: newUser});
  }
  catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }

};

const Login = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = GenerateToken({ id: user.id , email : user.email , name : user.name });
    res.cookie('token', token, { 
        httpOnly: true,
        secure: true,
        sameSite: 'Strict' , 
        maxAge: 10 * 60 * 60 * 1000 
    });
    console.log(token)
    res.status(200).json({ success: true, user });
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

};

const Logout = (req, res) => {

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });

};

const GetCurrentUser = (req, res) => {

    const user = req.user || null;
    res.status(200).json({ success: true, user });

};

module.exports = {
    Register,
    Login,
    Logout,
    GetCurrentUser
};