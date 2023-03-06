const jwt = require('jsonwebtoken');
const { httpErrorCodes } = require('../utils/httpStatusCodes');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED);
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(httpErrorCodes.clientError.ACCESS_FORBIDDEN); //invalid token
            req.user = decoded.UserInfo.username;
            req.email = decoded.email;
            req.roles = decoded.UserInfo.roles?.map(role => Number(role));
            next();
        }
    );
}

module.exports = verifyJWT;