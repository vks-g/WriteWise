
const ValidateSignup = (req, res, next) => {

    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }
    if (password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' })
    }
    next()

}

const ValidateLogin = (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }
    next()

}

const ValidatePost = (req, res, next) => {

    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
    }
    next()

}

const ValidateComment = (req, res, next) => {

    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' })
    }
    next()

}

module.exports = {
    ValidateSignup,
    ValidateLogin,
    ValidatePost,
    ValidateComment,
}