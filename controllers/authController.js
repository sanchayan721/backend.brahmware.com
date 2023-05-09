const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { httpSuccessCodes, httpErrorCodes } = require('../utils/httpStatusCodes');
const { cookieExtras } = require('../utils/cookieExtras');
const TokenGenerator = require('../helpers/TokenGenerator');
const ErrorSender = require('../helpers/ErrorSender');
const { ALT } = require('../utils/properties');
const ApplicationError = require('../utils/ApplicationError');
const { sendNoUserFoundError } = require('../utils/commonErrors/noUserFound');
const { sendIncompleteForm } = require('../utils/commonErrors/incompleteForm');

const handleLogin = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) return sendIncompleteForm(res, `Username or Email and password are required.`)

    const foundUser = await User.findOne({
        $or: [{ username: user }, { email: user }]
    }).select("+password").exec(); // Password field is not selected by default

    if (!foundUser) return sendNoUserFoundError(res)

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

    else return new ErrorSender(
        new ApplicationError(
            'Unauthorized',
            httpErrorCodes.clientError.ACCESS_UNAUTHORIZED,
            {
                errorType: 'UNAUTHORIZED_USER',
                property: ALT,
                errorMessage: `Wrong Username or Password!`
            }
        ),
        res
    ).sendError();

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

const handleResetPassword = async (req, res) => {

    console.log(req.body)
    const { user, password } = req.body;
    if (!user || !password) return new ErrorSender(
        new ApplicationError(
            'No user',
            httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
            {
                errorType: 'INCOMPLETE_INFORMATION',
                property: ALT,
                errorMessage: `Please provide your Username or Email and password.`
            }
        ),
        res
    ).sendError();

    const foundUser = await User.findOne({
        $or: [{ username: user }, { email: user }]
    }).select("+password").exec();

    if (!foundUser) return sendNoUserFoundError(res);

    foundUser.password = password;

    try {
        await foundUser.save();
        res.status(httpSuccessCodes.ACCPEPTED).json({
            "message": `Successfully updated your Password.`
        });
    } catch (error) {
        console.log(error)
        return new ErrorSender(
            new ApplicationError(
                'No user',
                httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
                {
                    errorType: 'SERVER_ERROR',
                    property: ALT,
                    errorMessage: `Could not update your password. Please try again later.`
                }
            ),
            res
        ).sendError();
    }
}

const handleLogout = async (req, res) => {

};

module.exports = { handleLogin, handleRefresh, handleLogout, handleResetPassword };