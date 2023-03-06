const ErrorSender = require("../helpers/ErrorSender");
const ApplicationError = require("../utils/ApplicationError");
const { httpSuccessCodes, httpErrorCodes } = require("../utils/httpStatusCodes");
const { v4: uuidv4 } = require('uuid');
const fileAddressGenerator = require('../utils/fileAddressGenerator');
const metaTypes = require('../configs/metaTypes');
const fileSystem = require('fs');
const path = require('path');

const uploadFile = (req, res) => {

    const { meta, replace } = req.body;

    if (!meta) {
        const errorSender = new ErrorSender(
            new ApplicationError(
                'No Meta Provided',
                httpErrorCodes.clientError.BAD_REQUEST,
                {
                    property: 'meta',
                    errorMessage: 'No Metadata Present in body!',
                }
            ),
            res
        );
        return errorSender.sendError();
    };

    const attachedFile = req.files[meta];

    if (!replace) {

        const fileName = `${uuidv4()}-${attachedFile?.name.replace(' ', '-')}`;
        const pathName = path.join(process.env.ROOT_FILE_UPLOAD_PATH, meta, fileName);
    
        attachedFile.mv(pathName, (error) => {
            if (!error) {
                return res.status(httpSuccessCodes.CREATED).json({
                    message: `file ${fileName} saved!`,
                    fileAddress: fileAddressGenerator(meta, fileName)
                });
            }

            else {
                const errorSender = new ErrorSender(
                    new ApplicationError(
                        'Upload Failed',
                        httpErrorCodes.serverError.INTERNAL_SERVER_ERROR,
                        {
                            property: 'alt',
                            errorMessage: `Something went wrong! File ${fileName} not saved! Please try again.`
                        }
                    ),
                    res
                );

                return errorSender.sendError();
            }
        });

    }



};

const getFile = async (req, res) => {

    const { meta, fileName } = req.params;

    console.log(meta, fileName)

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
    const readStream = fileSystem.createReadStream(filePath);
    readStream.on('error', function (err) {
        console.log(err);
        const errorSender = new ErrorSender(
            new ApplicationError(
                'No Media Found',
                httpErrorCodes.clientError.RESOURCE_NOT_FOUNDT,
                {
                    property: 'alt',
                    errorMessage: `No Media Found!`
                }
            ),
            res
        );

        return errorSender.sendError();
    });
    readStream.pipe(res);

}


module.exports = { uploadFile, getFile };