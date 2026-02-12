const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../commons/exceptions/InvariantError');
const NotFoundError = require('../../commons/exceptions/NotFoundError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `playlist-song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
    }

    async getSongsFromPlaylistId(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
      JOIN playlist_songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus dari playlist');
        }
    }

    async verifySongExists(songId) {
        const query = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
    }
}

module.exports = PlaylistSongsService;
