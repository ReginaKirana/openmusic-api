const express = require('express');
const multer = require('multer');
const AlbumsHandler = require('./handler');
const authMiddleware = require('../../commons/middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 512000 },
});

const routes = (service, validator, storageService, uploadsValidator, likesService) => {
    const router = express.Router();
    const handler = new AlbumsHandler(service, validator, storageService, uploadsValidator, likesService);

    router.post('/', handler.postAlbumHandler);
    router.get('/:id', handler.getAlbumByIdHandler);
    router.put('/:id', handler.putAlbumByIdHandler);
    router.delete('/:id', handler.deleteAlbumByIdHandler);
    router.post('/:id/covers', upload.single('cover'), handler.postUploadCoverHandler);
    router.post('/:id/likes', authMiddleware, handler.postLikeHandler);
    router.delete('/:id/likes', authMiddleware, handler.deleteLikeHandler);
    router.get('/:id/likes', handler.getLikesHandler);

    return router;
};

module.exports = routes;
