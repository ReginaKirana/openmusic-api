
exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            allowNull: true,
        },
        album_id: {
            type: 'VARCHAR(50)',
            allowNull: true,
        },
    });

    // Adding FK constraint
    pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', {
        foreignKeys: {
            columns: 'album_id',
            references: 'albums(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('songs');
};
