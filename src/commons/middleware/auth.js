const TokenManager = require('../tokenize/TokenManager');
const AuthenticationError = require('../exceptions/AuthenticationError');
const ClientError = require('../exceptions/ClientError');

const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new AuthenticationError('Anda tidak berhak mengakses resource ini. Token tidak ditemukan.');
    }

    const token = authorization.split(' ')[1];

    try {
        const { userId } = TokenManager.verifyAccessToken(token);
        req.user = { id: userId };
        next();
    } catch (error) {
        if (error instanceof ClientError) {
            throw error;
        }
        throw new AuthenticationError('Anda tidak berhak mengakses resource ini. Token tidak valid.');
    }
};

module.exports = authMiddleware;
