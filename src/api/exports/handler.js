const autoBind = require('auto-bind');

class ExportsHandler {
    constructor(service, validator, playlistsService) {
        this._service = service;
        this._validator = validator;
        this._playlistsService = playlistsService;

        autoBind(this);
    }

    async postExportPlaylistsHandler(req, res, next) {
        try {
            this._validator.validateExportPlaylistsPayload(req.body);

            const { playlistId } = req.params;
            const { id: credentialId } = req.user; // Assuming auth middleware populates req.user

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

            const message = {
                playlistId,
                targetEmail: req.body.targetEmail,
            };

            await this._service.sendMessage('export:playlists', JSON.stringify(message));

            const response = {
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
            };
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ExportsHandler;
