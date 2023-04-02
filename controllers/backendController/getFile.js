const path = require("path");
const metaTypes = require("../../configs/metaTypes");
const ErrorSender = require("../../helpers/ErrorSender");
const ApplicationError = require("../../utils/ApplicationError");
const { httpErrorCodes } = require("../../utils/httpStatusCodes");
const fileSystem = require('fs');
const defaultFileNames = require("../../configs/defaultFileNames");

const getFile = async (req, res) => {

    const { meta, fileName } = req.params;

    /* console.log(meta, fileName) */

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

    const filePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, meta, fileName);
    const defaultFilePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, meta, defaultFileNames.profilePicture);
    const readStream = fileSystem.createReadStream(filePath);
    readStream.on('error', function (err) {
        const defaultFilestream = fileSystem.createReadStream(defaultFilePath);
        defaultFilestream.pipe(defaultFilestream);
        defaultFilestream.on('error', (error) => {
            console.log('hi')
            const errorSender = new ErrorSender(
                new ApplicationError(
                    'No Default Media Found',
                    httpErrorCodes.serverError.BAD_GATEWAY,
                    {
                        property: 'alt',
                        errorMessage: `No Deault Media Found!`
                    }
                ),
                res
            );

            return errorSender.sendError();
        })
    });

    return readStream.pipe(res);
}


module.exports = getFile;


/* const errorSender = new ErrorSender(
            new ApplicationError(
                'No Media Found',
                httpErrorCodes.clientError.RESOURCE_NOT_FOUND,
                {
                    property: 'alt',
                    errorMessage: `No Media Found!`
                }
            ),
            res
        );

        return errorSender.sendError(); */