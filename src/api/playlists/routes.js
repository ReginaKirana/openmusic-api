const express = require('express');
const PlaylistsHandler = require('./handler');

const routes = (service, validator) => {
    const router = express.Router();
    const handler = new PlaylistsHandler(service, validator);

    router.post('/', handler.postPlaylistHandler);
    router.get('/', handler.getPlaylistsHandler);
    router.delete('/:id', handler.deletePlaylistByIdHandler);

    router.post('/:id/songs', handler.postSongToPlaylistHandler);
    router.get('/:id/songs', handler.getSongsFromPlaylistHandler);
    router.delete('/:id/songs', handler.deleteSongFromPlaylistHandler);

    router.get('/:id/activities', handler.getPlaylistActivitiesHandler);

    return router;
};

module.exports = routes;
