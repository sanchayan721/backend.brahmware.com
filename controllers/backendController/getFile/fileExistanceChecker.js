const path = require("path");
const fileSystem = require('fs');
const defaultFileNames = require("../../../configs/defaultFileNames");

const fileExistanceChecker = (req, res) => {
    const filePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, req.params.meta, req.params.fileName);

    console.log(filePath)

    if (!fileSystem.existsSync(filePath)) {
        const defaultFilePath = path.join(process.env.ROOT_FILE_UPLOAD_PATH, req.params.meta, defaultFileNames[req.params.meta]);
        console.log(defaultFilePath)

        const readStream = fileSystem.createReadStream(defaultFilePath);

        console.log(readStream)
        return readStream.pipe(res);
    }
};

module.exports = fileExistanceChecker;