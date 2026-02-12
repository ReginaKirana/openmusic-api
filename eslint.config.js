const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    {
        files: ['src/**/*.js'],
        rules: {
            'no-console': 'off',
            'camelcase': 'off',
            'no-underscore-dangle': 'off',
        },
    },
];
