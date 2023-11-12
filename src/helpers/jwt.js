const jwt = require('jsonwebtoken')
require('dotenv').config({
    path: '.env'
});

const createToken = (data) => {
    const accessToken = jwt.sign(
        { name: data.username, signature: data.signature },
        process.env.SECRET_KEY,
        { expiresIn: Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60 }
    );
    return accessToken;

}

const validateToken = async (req, res, next) => {
    try {
        const { key } = req.headers 
        const token = key.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY)
        next();

    } catch (err) {
        const response = res.status(400).json({
            status: 'fail',
            message: err.message
        })
        return response
    }
}

module.exports = {
    createToken, validateToken
}