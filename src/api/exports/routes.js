const express = require('express');
const ExportsHandler = require('./handler');

const routes = (service, validator, playlistsService) => {
    const router = express.Router();
    const handler = new ExportsHandler(service, validator, playlistsService);

    router.post('/playlists/:playlistId', handler.postExportPlaylistsHandler);

    return router;
};

module.exports = routes;
