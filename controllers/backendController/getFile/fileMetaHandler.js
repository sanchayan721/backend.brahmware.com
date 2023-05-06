const metaTypes = require("../../../configs/metaTypes");
const ErrorSender = require("../../../helpers/ErrorSender");
const ApplicationError = require("../../../utils/ApplicationError");
const { httpErrorCodes } = require("../../../utils/httpStatusCodes");

const fileMetaChecker = (meta, res) => {
    if (!meta) {

        const errorSender = new ErrorSender(
            new ApplicationError(
                'No Meta Present',
                httpErrorCodes.clientError.BAD_REQUEST,
                {
                    property: 'alt',
                    errorMessage: `No such file exists!`
                }
            ),
            res
        );

        return errorSender.sendError();
    };

    if (!Object.values(metaTypes).includes(meta)) {

        const errorSender = new ErrorSender(
            new ApplicationError(
                'Incorrect Meta Type',
                httpErrorCodes.clientError.BAD_REQUEST,
                {
                    property: 'alt',
                    errorMessage: `Unknown meta type!`
                }
            ),
            res
        );

        return errorSender.sendError();
    };
};

module.exports = fileMetaChecker;