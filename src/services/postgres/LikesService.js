const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../commons/exceptions/InvariantError');
const NotFoundError = require('../../commons/exceptions/NotFoundError');

class LikesService {
    constructor(cacheService) {
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });
        this._cacheService = cacheService;
    }

    async addLike(userId, albumId) {
        const queryCheck = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId],
        };
        const resultCheck = await this._pool.query(queryCheck);
        if (!resultCheck.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const queryLikeCheck = {
            text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
        const resultLikeCheck = await this._pool.query(queryLikeCheck);
        if (resultLikeCheck.rows.length > 0) {
            throw new InvariantError('Anda sudah menyukai album ini');
        }

        const id = `like-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menyukai album');
        }

        await this._cacheService.delete(`likes:${albumId}`);
    }

    async deleteLike(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Gagal membatalkan like');
        }

        await this._cacheService.delete(`likes:${albumId}`);
    }

    async getLikes(albumId) {
        try {
            const result = await this._cacheService.get(`likes:${albumId}`);
            return {
                likes: JSON.parse(result),
                isCache: true,
            };
        } catch (error) {
            const query = {
                text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
                values: [albumId],
            };

            const result = await this._pool.query(query);
            const likes = parseInt(result.rows[0].count, 10);

            await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes));

            return {
                likes,
                isCache: false,
            };
        }
    }
}

module.exports = LikesService;
