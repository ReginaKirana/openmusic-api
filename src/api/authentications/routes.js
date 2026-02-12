const express = require('express');
const AuthenticationsHandler = require('./handler');

const routes = (authenticationsService, usersService, tokenManager, validator) => {
    const router = express.Router();
    const handler = new AuthenticationsHandler(authenticationsService, usersService, tokenManager, validator);

    router.post('/', handler.postAuthenticationHandler);
    router.put('/', handler.putAuthenticationHandler);
    router.delete('/', handler.deleteAuthenticationHandler);

    return router;
};

module.exports = routes;
