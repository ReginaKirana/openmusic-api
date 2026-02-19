const express = require('express');
const multer = require('multer');
const InvariantError = require('../../commons/exceptions/InvariantError');
const PayloadTooLargeError = require('../../commons/exceptions/PayloadTooLargeError');
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
    router.post('/:id/covers', (req, res, next) => {
        upload.single('cover')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new PayloadTooLargeError('Ukuran gambar terlalu besar, maksimal 512KB'));
                }
                return next(new InvariantError(err.message));
            } else if (err) {
                return next(err);
            }
            next();
        });
    }, handler.postUploadCoverHandler);
    router.post('/:id/likes', authMiddleware, handler.postLikeHandler);
    router.delete('/:id/likes', authMiddleware, handler.deleteLikeHandler);
    router.get('/:id/likes', handler.getLikesHandler);

    return router;
};

module.exports = routes;
