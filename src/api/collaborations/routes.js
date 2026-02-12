const express = require('express');
const CollaborationsHandler = require('./handler');

const routes = (collaborationsService, playlistsService, usersService, validator) => {
    const router = express.Router();
    const handler = new CollaborationsHandler(collaborationsService, playlistsService, usersService, validator);

    router.post('/', handler.postCollaborationHandler);
    router.delete('/', handler.deleteCollaborationHandler);

    return router;
};

module.exports = routes;
