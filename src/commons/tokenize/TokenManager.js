const Jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE, 10) || 1800,
    }),
    generateRefreshToken: (payload) => Jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
            return artifacts;
        } catch {
            throw new InvariantError('Refresh token tidak valid');
        }
    },
    verifyAccessToken: (accessToken) => {
        try {
            const artifacts = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
            return artifacts;
        } catch {
            throw new InvariantError('Access token tidak valid');
        }
    },
};

module.exports = TokenManager;
