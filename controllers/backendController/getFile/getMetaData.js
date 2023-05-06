const { emptyFileType, supportedFileTypes } = require("../../../configs/supportedFileTypes");

const getMetaData = (filePath) => {
    
    const fileTypesMetaData = [...Object.keys(supportedFileTypes)];
    return fileTypesMetaData.reduce(
        (

            actualFileType,
            currentFileTypeName

        ) => {
            
            return filePath.includes(currentFileTypeName) ?
            supportedFileTypes[currentFileTypeName] :
            actualFileType
            
        },
        emptyFileType
    );
};

module.exports = getMetaData;