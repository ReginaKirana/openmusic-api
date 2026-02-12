const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../commons/exceptions/InvariantError');
const NotFoundError = require('../../commons/exceptions/NotFoundError');
const AuthorizationError = require('../../commons/exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });
        this._collaborationService = collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(id, userId) {
        try {
            await this.verifyPlaylistOwner(id, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(id, userId);
            } catch {
                throw error;
            }
        }
    }

    async getPlaylistById(id) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = PlaylistsService;
