const fileLocation = (req, res, next) => {
    const { meta, fileName } = req.params;
    console.log(meta, fileName);
    next();
};

module.exports = fileLocation;