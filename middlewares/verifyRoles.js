const { httpErrorCodes } = require("../utils/httpStatusCodes");

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED);
        const result = req.roles.map(role => allowedRoles.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(httpErrorCodes.clientError.ACCESS_UNAUTHORIZED);
        next();
    }
};

module.exports = verifyRoles;