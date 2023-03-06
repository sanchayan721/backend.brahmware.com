const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../configs/roles_list');
const regexVerification = require('../utils/regexValidation');

const nameSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },

    firstName: {
        type: String,
    },

    middleName: {
        type: String,
    },

    lastName: {
        type: String
    }
}, { _id: false });

const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },

    username: {
        type: String,
        required: [true, "Please Provide a username"],
        unique: true
    },
    
    email: {
        type: String,
        required: [true, "Please Provide a username"],
        unique: true
    },
    
    fullName: {
        type: nameSchema
    },

    roles: {
        type: [String],
        default: [ROLES_LIST.Handeler]
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    profilePicture: {
        type: String
    },

    disabled: {
        type: Boolean,
        default: false
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + Number(process.env.PASSWORD_RESET_EXPIRE) * MINUTES_TO_MIL_SECONDS;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);