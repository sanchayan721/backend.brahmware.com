const ErrorSender = require("../../../helpers/ErrorSender");
const ApplicationError = require("../../../utils/ApplicationError");
const { httpErrorCodes } = require("../../../utils/httpStatusCodes");

const fileNameChecker = (fileName, res) => {

    if (!fileName) {
        const errorSender = new ErrorSender(
            new ApplicationError(
                'No File Name',
                httpErrorCodes.clientError.BAD_REQUEST,
                {
                    property: 'alt',
                    errorMessage: `No file name provided!`
                }
            ),
            res
        );

        return errorSender.sendError();
    };

};

module.exports = fileNameChecker;
