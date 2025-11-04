const jwt = require('jsonwebtoken');

const generateToken = (user) => {

    return jwt.sign({
        id: user.id,
        username: user.username,
        profilePic: user.profilePic,
        folllowers: user.folllowers,
        following: user.following
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'

        })
}
module.exports = generateToken;