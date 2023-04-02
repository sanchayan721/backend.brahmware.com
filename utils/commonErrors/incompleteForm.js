const ErrorSender = require("../../helpers/ErrorSender");
const ApplicationError = require("../ApplicationError");
const { httpErrorCodes } = require("../httpStatusCodes");
const { ALT } = require("../properties");

const sendIncompleteForm = (res, message) => {
    return new ErrorSender(
        new ApplicationError(
            'No user',
            httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
            {
                errorType: 'INCOMPLETE_FORM',
                property: ALT,
                errorMessage: message
            }
        ),
        res
    ).sendError();
};

module.exports = { sendIncompleteForm };