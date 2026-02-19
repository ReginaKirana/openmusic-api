const InvariantError = require('../../commons/exceptions/InvariantError');

class AlbumsHandler {
    constructor(service, validator, storageService, uploadsValidator, likesService) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;
        this._uploadsValidator = uploadsValidator;
        this._likesService = likesService;

        this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
        this.postLikeHandler = this.postLikeHandler.bind(this);
        this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
        this.getLikesHandler = this.getLikesHandler.bind(this);

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postUploadCoverHandler(req, res, next) {
        try {
            if (!req.file) {
                throw new InvariantError('Missing file');
            }

            this._uploadsValidator.validateImageHeaders({ 'content-type': req.file.mimetype });

            const filename = await this._storageService.writeFile(req.file, { filename: req.file.originalname });
            const coverUrl = `${req.protocol}://${req.get('host')}/upload/images/${filename}`;

            const { id } = req.params;
            await this._service.editAlbumCoverById(id, coverUrl);

            res.status(201).json({
                status: 'success',
                message: 'Sampul berhasil diunggah',
            });
        } catch (error) {
            next(error);
        }
    }

    async postAlbumHandler(req, res, next) {
        try {
            this._validator.validateAlbumPayload(req.body);
            const { name, year } = req.body;
            const albumId = await this._service.addAlbum({ name, year });

            res.status(201).json({
                status: 'success',
                data: {
                    albumId,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAlbumByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            const album = await this._service.getAlbumById(id);
            res.json({
                status: 'success',
                data: {
                    album,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async putAlbumByIdHandler(req, res, next) {
        try {
            this._validator.validateAlbumPayload(req.body);
            const { id } = req.params;
            await this._service.editAlbumById(id, req.body);

            res.json({
                status: 'success',
                message: 'Album berhasil diperbarui',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAlbumByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            await this._service.deleteAlbumById(id);

            res.json({
                status: 'success',
                message: 'Album berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }

    async postLikeHandler(req, res, next) {
        try {
            const { id } = req.params;
            const { id: credentialId } = req.user;

            await this._likesService.addLike(credentialId, id);

            res.status(201).json({
                status: 'success',
                message: 'Menyukai album',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteLikeHandler(req, res, next) {
        try {
            const { id } = req.params;
            const { id: credentialId } = req.user;

            await this._likesService.deleteLike(credentialId, id);

            res.json({
                status: 'success',
                message: 'Batal menyukai album',
            });
        } catch (error) {
            next(error);
        }
    }

    async getLikesHandler(req, res, next) {
        try {
            const { id } = req.params;
            const { likes, isCache } = await this._likesService.getLikes(id);

            if (isCache) {
                res.header('X-Data-Source', 'cache');
            }

            res.json({
                status: 'success',
                data: {
                    likes,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AlbumsHandler;
