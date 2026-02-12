const express = require('express');
const SongsHandler = require('./handler');

const routes = (service, validator) => {
    const router = express.Router();
    const handler = new SongsHandler(service, validator);

    router.post('/', handler.postSongHandler);
    router.get('/', handler.getSongsHandler);
    router.get('/:id', handler.getSongByIdHandler);
    router.put('/:id', handler.putSongByIdHandler);
    router.delete('/:id', handler.deleteSongByIdHandler);

    return router;
};

module.exports = routes;
