const { DAY_IN_MIL_SECONDS } = require("./timeFormats");

const cookieExtras = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: Number(process.env.REFRESH_EXPIRE) * DAY_IN_MIL_SECONDS
};

module.exports = cookieExtras;