const fileAddressGenerator = (meta, fileName) => {
    return `${process.env.SERVER_ADDRESS}/backend_controller/get_file/${meta}/${fileName}`
};

module.exports = fileAddressGenerator;