const { httpErrorCodes, httpSuccessCodes } = require('../utils/httpStatusCodes');
const User = require('../models/User');
const PasswordGenerator = require('../helpers/PasswordGenerator');
const { duplicateCheck } = require('../utils/checks');
const ErrorSender = require('../helpers/ErrorSender');
const ApplicationError = require('../utils/ApplicationError');

const handleNewUser = async (req, res) => {

    const {
        username,
        email,
        fullName,
        password,
        roles,
        profilePicture
    } = req.body;

    try {

        let userPassword = password;

        if (!username || !email || !Array.isArray(roles)) return res.status(httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE).json({
            'message': 'All fields are required!'
        });

        await Promise.all([
            duplicateCheck(User, { username }),
            duplicateCheck(User, { email })
        ]);

        const passwordGenerator = new PasswordGenerator(10);

        if (!password) {
            userPassword = passwordGenerator.generateNewPassword();
        }
        console.log(password);

        const userObject = {
            username,
            email,
            fullName,
            password: userPassword,
            roles,
            profilePicture
        };

        await User.create(userObject);
        res.status(httpSuccessCodes.ACCPEPTED).json({ "message": `New user ${username} created` });

    } catch (error) {
        console.log(error)
        let errorSender = new ErrorSender(error, res);
        errorSender.sendError();
    }

};

const findAllUsers = async (_req, res) => {
    const foundUsers = await User.find({}).exec();

    if (foundUsers.length === 0) return res.send(httpSuccessCodes.NO_CONTENT).json({ "message": "No users found!" });

    return res.status(httpSuccessCodes.OK).json([...foundUsers]);
};

const findUser = async (req, res) => {

};


const editUser = async (req, res) => {

    const { username } = req.params;
    const {
        email,
        roles,
        fullName,
        disabled,
        profilePicture
    } = req.body;

    if (!username || !email || !Array.isArray(roles)) {
        const errorSender = new ErrorSender(
            new ApplicationError(
                'Incomplete Data',
                httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
                {
                    'property': 'alt',
                    'errorMessage': 'All fields are required!'
                }
            ), 
            res
        )
        return errorSender.sendError();
    };

    const user = await User.findOne({ username }).exec();

    if (!user) {
        const errorSender = new ErrorSender(
            new ApplicationError(
                'No User Found',
                httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
                {
                    'property': 'alt',
                    'errorMessage': 'User not found!'
                }
            ), 
            res
        )
        return errorSender.sendError();
    };

    const duplicateEmail = await User.findOne({ email }).exec();

    if (duplicateEmail && duplicateEmail.username !== username) {
        const errorSender = new ErrorSender(
            new ApplicationError(
                'Duplicate Email',
                httpErrorCodes.clientError.CONFLICT,
                {
                    'property': 'email',
                    'errorMessage': 'Email already taken!'
                }
            ),
            res
        )
        return errorSender.sendError();
    };

    user.email = email;
    user.roles = roles;
    user.fullName = fullName;
    user.disabled = disabled;
    user.profilePicture = profilePicture;

    try {
        const updatedUser = await user.save();
        res.status(httpSuccessCodes.ACCPEPTED).json({
            "message": `Successfully updated ${updatedUser.username}'s profile.`
        });
    } catch (error) {
        res.status(httpErrorCodes.serverError.INTERNAL_SERVER_ERROR).json({
            "message": `Could not update ${username}! Please try again.`
        });
    }
};

const deleteUser = async (req, res) => {
    const { username } = req.params;

    if (!username) return res.status(httpErrorCodes.clientError.BAD_REQUEST).json({
        'message': 'Username Required!'
    });

    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(httpErrorCodes.clientError.RESOURCE_NOT_FOUND).json({
        "message": "User not found!"
    });

    const result = await user.deleteOne();
    res.status(httpSuccessCodes.ACCPEPTED).json({
        "message": `User ${result.username} deleted!`
    });

};

module.exports = {
    handleNewUser,
    findAllUsers,
    findUser,
    editUser,
    deleteUser
};
