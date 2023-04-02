const ApplicationError = require("./ApplicationError");
const { httpErrorCodes } = require("./httpStatusCodes");

const saveFileToDisk = async (targetPath, file) => {
    try {
        file.mv(targetPath, (error) => {
            if (!error) return true;
            else throw new ApplicationError(
                'File Not Saved!',
                httpErrorCodes.serverError.SERVICE_UNAVAILAVLE,
                {
                    property: 'alt',
                    errorMessage: `Something went wrong! File ${fileName} not saved! Please try again.`
                }
            );
        });
    } catch (error) {
        throw error;
    }
};

module.exports = saveFileToDisk;