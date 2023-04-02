const ErrorSender = require("../../helpers/ErrorSender");
const ApplicationError = require("../ApplicationError");
const { httpErrorCodes } = require("../httpStatusCodes");

const sendNoUserFoundError = (res) => {
    return new ErrorSender(
        new ApplicationError(
            'No user',
            httpErrorCodes.clientError.RESOURCE_NOT_FOUND,
            {
                errorType: 'NO_USER',
                property: 'user',
                errorMessage: `No user found!`
            }
        ),
        res
    ).sendError();
};

module.exports = { sendNoUserFoundError };