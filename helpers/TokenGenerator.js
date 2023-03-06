const jwt = require('jsonwebtoken');

class TokenGenerator {

    #username;
    #email;
    #roles;

    constructor(username, email, roles) {
        this.#username = username;
        this.#email = email;
        this.#roles = roles;
    }

    generateAccessToken() {
        return jwt.sign(
            {
                "UserInfo": {
                    username: this.#username,
                    email: this.#email,
                    roles: this.#roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: Number(process.env.ACCESS_EXPIRE) }
        )
    }

    generateRefreshToken() {
        return jwt.sign(
            {
                username: this.#username,
                email: this.#email,
                roles: this.#roles
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: `${process.env.REFRESH_EXPIRE}d` }
        )
    }
}

module.exports = TokenGenerator;