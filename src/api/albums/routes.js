const express = require('express');
const AlbumsHandler = require('./handler');

const routes = (service, validator) => {
    const router = express.Router();
    const handler = new AlbumsHandler(service, validator);

    router.post('/', handler.postAlbumHandler);
    router.get('/:id', handler.getAlbumByIdHandler);
    router.put('/:id', handler.putAlbumByIdHandler);
    router.delete('/:id', handler.deleteAlbumByIdHandler);

    return router;
};

module.exports = routes;
