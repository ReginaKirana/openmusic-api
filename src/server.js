require('dotenv').config();

const express = require('express');

const albumsRoutes = require('./api/albums/routes');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const songsRoutes = require('./api/songs/routes');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const usersRoutes = require('./api/users/routes');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authenticationsRoutes = require('./api/authentications/routes');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./commons/tokenize/TokenManager');

const playlistsRoutes = require('./api/playlists/routes');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');
const collaborationsRoutes = require('./api/collaborations/routes');

const ClientError = require('./commons/exceptions/ClientError');

const authMiddleware = require('./commons/middleware/auth');

const init = async () => {
    const app = express();
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || 'localhost';

    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const playlistSongsService = new PlaylistSongsService();
    const playlistActivitiesService = new PlaylistActivitiesService();

    app.use(express.json());

    app.use('/albums', albumsRoutes(albumsService, AlbumsValidator));
    app.use('/songs', songsRoutes(songsService, SongsValidator));
    app.use('/users', usersRoutes(usersService, UsersValidator));
    app.use('/authentications', authenticationsRoutes(authenticationsService, usersService, TokenManager, AuthenticationsValidator));
    app.use('/playlists', authMiddleware, playlistsRoutes({ playlistsService, playlistSongsService, playlistActivitiesService }, PlaylistsValidator));
    app.use('/collaborations', authMiddleware, collaborationsRoutes(collaborationsService, playlistsService, usersService, CollaborationsValidator));


    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        require('fs').writeFileSync('server-error.log', `[${new Date().toISOString()}] ${err.stack}\n`, { flag: 'a' });
        console.log('Error caught:', err.name, err.message, err.statusCode);
        if (err instanceof ClientError) {
            return res.status(err.statusCode).json({
                status: 'fail',
                message: err.message,
            });
        }

        if (err.name === 'SyntaxError') {
            return res.status(400).json({
                status: 'fail',
                message: err.message,
            });
        }

        console.error(err);
        return res.status(500).json({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
    });

    app.listen(port, host, () => {
        console.log(`Server berjalan pada http://${host}:${port}`);
    });
};

init();
