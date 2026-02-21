exports.up = (pgm) => {
    pgm.addColumn('albums', {
        cover: {
            type: 'VARCHAR(255)',
            default: null,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('albums', 'cover');
};
