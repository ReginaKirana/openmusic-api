class PlaylistsHandler {
    constructor({ playlistsService, playlistSongsService, playlistActivitiesService }, validator) {
        this._playlistsService = playlistsService;
        this._playlistSongsService = playlistSongsService;
        this._playlistActivitiesService = playlistActivitiesService;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
        this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
        this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
        this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
    }

    async postPlaylistHandler(req, res, next) {
        try {
            this._validator.validatePostPlaylistPayload(req.body);
            const { name } = req.body;
            const { id: credentialId } = req.user;

            const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

            res.status(201).json({
                status: 'success',
                data: {
                    playlistId,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistsHandler(req, res, next) {
        try {
            const { id: credentialId } = req.user;
            const playlists = await this._playlistsService.getPlaylists(credentialId);

            console.log(`[DEBUG] Get Playlists. User: ${credentialId}, Found: ${playlists.length}`);

            res.json({
                status: 'success',
                data: {
                    playlists,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePlaylistByIdHandler(req, res, next) {
        try {
            const { id } = req.params;
            const { id: credentialId } = req.user;

            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            await this._playlistsService.deletePlaylistById(id);

            res.json({
                status: 'success',
                message: 'Playlist berhasil dihapus',
            });
        } catch (error) {
            next(error);
        }
    }

    async postSongToPlaylistHandler(req, res, next) {
        try {
            this._validator.validatePostSongToPlaylistPayload(req.body);
            const { id: playlistId } = req.params;
            const { songId } = req.body;
            const { id: credentialId } = req.user;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistSongsService.verifySongExists(songId);
            await this._playlistSongsService.addSongToPlaylist(playlistId, songId);

            await this._playlistActivitiesService.logActivity(playlistId, songId, credentialId, 'add');

            res.status(201).json({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
            });
        } catch (error) {
            next(error);
        }
    }

    async getSongsFromPlaylistHandler(req, res, next) {
        try {
            const { id: playlistId } = req.params;
            const { id: credentialId } = req.user;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId) // To get playlist info safely? 
                .then(() => {/* It returns void in service, need to fetch */ })
                .catch(async () => {
                    // If verifyOwner fails (collab), we still need playlist info.
                    // We can fetch playlist info separately.
                    // Wait, verifyPlaylistOwner verifies OWNER.
                    // verifyPlaylistAccess verifies Access.
                    // We passed check above.
                });

            // Need a method to get playlist info (id, name, username of owner)
            // I'll add getPlaylistById in PlaylistsService
            const playlistDetails = await this._playlistsService.getPlaylistById(playlistId);
            const songs = await this._playlistSongsService.getSongsFromPlaylistId(playlistId);

            res.json({
                status: 'success',
                data: {
                    playlist: {
                        ...playlistDetails,
                        songs,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteSongFromPlaylistHandler(req, res, next) {
        try {
            this._validator.validateDeleteSongFromPlaylistPayload(req.body);
            const { id: playlistId } = req.params;
            const { songId } = req.body;
            const { id: credentialId } = req.user;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

            await this._playlistActivitiesService.logActivity(playlistId, songId, credentialId, 'delete');

            res.json({
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
            });
        } catch (error) {
            next(error);
        }
    }

    async getPlaylistActivitiesHandler(req, res, next) {
        try {
            const { id: playlistId } = req.params;
            const { id: credentialId } = req.user;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const activities = await this._playlistActivitiesService.getActivities(playlistId);

            res.json({
                status: 'success',
                data: {
                    playlistId,
                    activities,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PlaylistsHandler;
