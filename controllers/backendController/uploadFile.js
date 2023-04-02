const path = require("path");
const ErrorSender = require("../../helpers/ErrorSender");
const fileAddressGenerator = require("../../utils/fileAddressGenerator");
const { httpErrorCodes, httpSuccessCodes } = require("../../utils/httpStatusCodes");
const { v4: uuidv4 } = require('uuid');
const ApplicationError = require("../../utils/ApplicationError");
const fileSystem = require('fs');
const defaultFileNames = require("../../configs/defaultFileNames");
const saveFileToDisk = require("../../utils/saveFileToDisk");

const uploadFile = async (req, res) => {

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

    const fileName = `${uuidv4()}-${attachedFile?.name.replace(' ', '-')}`;
    const pathName = path.join(process.env.ROOT_FILE_UPLOAD_PATH, meta, fileName);

    try {
        await saveFileToDisk(pathName, attachedFile);
        res.status(httpSuccessCodes.CREATED).json({
            message: `file ${fileName} saved!`,
            fileAddress: fileAddressGenerator(meta, fileName)
        });
    }

    catch (error) {
        new ErrorSender(error, res).sendError();
    };


    /*
    * Checking if there is something to replace. 
    * Checking if a default file is asked to replace.
    * Removing file from filesystem.
    */

    // Checking if there is something to replace
    if (!replace) return;

    // Checking if a default file is asked to replace
    if(Object.values(defaultFileNames).includes(replace)) return;

    // Removing file from filesystem
    const targetPath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, meta, replace);

    try {
        fileSystem.access(targetPath, fileSystem.constants.F_OK, (err) => { if (err) throw err });
        return fileSystem.unlink(targetPath);
    } catch (error) {
        console.log(error)
    }
};

module.exports = uploadFile;