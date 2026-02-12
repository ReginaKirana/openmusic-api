const express = require('express');
const UsersHandler = require('./handler');

const routes = (service, validator) => {
    const router = express.Router();
    const handler = new UsersHandler(service, validator);

    router.post('/', handler.postUserHandler);

    return router;
};

module.exports = routes;
