const ApplicationError = require("./ApplicationError")
const { httpErrorCodes } = require("./httpStatusCodes")

const bodyCheck = async (request, field) => {
    if (!request.body[field]) throw new ApplicationError(
        `No ${field}`,
        httpErrorCodes.clientError.ENTRY_NOT_ACCEPTABLE,
        {
            'property': field,
            'errorMessage': `${field} is required.`
        }
    )
};

const duplicateCheck = async (Model, searchable) => {
    const existingUser = await Model.findOne(searchable).exec();
    if (existingUser) throw new ApplicationError(
        `Duplicate ${Object.keys(searchable)[0]}`,
        httpErrorCodes.clientError.CONFLICT,
        {
            'property': Object.keys(searchable)[0],
            'errorMessage': `Duplicate ${Object.keys(searchable)[0]}`
        }
    )
};

module.exports = {
    bodyCheck,
    duplicateCheck
};