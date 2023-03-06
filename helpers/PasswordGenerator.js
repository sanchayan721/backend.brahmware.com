class PasswordGenerator {
    #length;

    constructor(length) {
        this.#length = length;
    }

    generateNewPassword() {
        var length = this.#length,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@-+*!",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
}

module.exports = PasswordGenerator;