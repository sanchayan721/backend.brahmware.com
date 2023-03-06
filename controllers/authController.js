const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { httpSuccessCodes, httpErrorCodes } = require('../utils/httpStatusCodes');
const { cookieExtras } = require('../utils/cookieExtras');
const TokenGenerator = require('../helpers/TokenGenerator');

const handleLogin = async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({
        $or: [{ username: username }, { email: username }]
    }).select("+password").exec(); // Password field is not selected by default

    if (!foundUser) return res.status(401).json({ 'message': 'Username or Password is incorrect!' }); //Unauthorized 

    // evaluate password 
    const match = await foundUser.matchPasswords(password);

    if (match) {

        const roles = Object.values(foundUser.roles);
        const username = foundUser.username;

        // create JWTs
        const tokenGenerator = new TokenGenerator(
            foundUser.username,
            foundUser.email,
            foundUser.roles
        );

        const accessToken = tokenGenerator.generateAccessToken();
        const refreshToken = tokenGenerator.generateRefreshToken();

        res.cookie('jwt', refreshToken, cookieExtras);

        try {

            await foundUser.save();

            // Send authorization roles and access token to user
            return res.status(httpSuccessCodes.ACCPEPTED).json({ username, roles, accessToken });

        } catch (error) {
            return res.sendStatus(httpErrorCodes.serverError.SERVICE_UNAVAILAVLE);
        }

    }

    else return res.status(401).json({ 'message': 'Wrong Username or Password!' });

};

const handleRefresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED);

    const refreshToken = cookies?.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async function (err, decoded) {

            if (err || !decoded?.email || !decoded?.username) return res.send(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED).json({
                "message": "Invalid Token! Please login."
            });

            const foundUser = await User.findOne({ username: decoded.username }).exec();
            if (!foundUser) return res.status(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED).json({
                "message": "Invalid Token! Please login."
            });

            if (foundUser.disabled) return res.send(httpErrorCodes.clientError.ACCESS_FORBIDDEN).json({
                "message": "Your account has been blocked!"
            });

            // create JWTs
            const tokenGenerator = new TokenGenerator(
                foundUser.username,
                foundUser.email,
                foundUser.roles
            );
            const accessToken = tokenGenerator.generateAccessToken();

            res.status(httpSuccessCodes.CREATED).json({ username: foundUser.username, roles: foundUser.roles, accessToken });

        }
    );
};

const handleLogout = async (req, res) => {
    
};

module.exports = { handleLogin, handleRefresh, handleLogout };