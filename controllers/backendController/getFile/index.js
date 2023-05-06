const path = require("path");
const ErrorSender = require("../../../helpers/ErrorSender");
const ApplicationError = require("../../../utils/ApplicationError");
const { httpErrorCodes } = require("../../../utils/httpStatusCodes");
const fileSystem = require('fs');
const defaultFileNames = require("../../../configs/defaultFileNames");
const fileMetaHandler = require("./fileMetaHandler");
const fileNameChecker = require("./fileNameChecker");
const getMetaData = require("./getMetaData");

const getFile = async (req, res) => {
    fileMetaHandler(req.params.meta, res);
    fileNameChecker(req.params.fileName, res);

    const filePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, req.params.meta, req.params.fileName);

    try {
        const stats = fileSystem.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': getMetaData(filePath).contentType,
            'Content-Length': stats.size
        });

        const readStream = fileSystem.createReadStream(filePath);
        readStream.pipe(res);

    } catch (err) {

        const defaultFilePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, req.params.meta, defaultFileNames[req.params.meta]);

        try {
            const stats = fileSystem.statSync(defaultFilePath);

            res.writeHead(200, {
                'Content-Type': getMetaData(defaultFilePath).contentType,
                'Content-Length': stats.size
            });

            const readStream = fileSystem.createReadStream(defaultFilePath);
            readStream.pipe(res);

        } catch (err) {
        
            const errorSender = new ErrorSender(
                new ApplicationError(
                    'No Default Media Found',
                    httpErrorCodes.serverError.BAD_GATEWAY,
                    {
                        property: 'alt',
                        errorMessage: `No Media Found!`
                    }
                ),
                res
            );

            errorSender.sendError();
        }
    }
};

module.exports = getFile;
