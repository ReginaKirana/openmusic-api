const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: 'postgres',
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

async function resetDb() {
    try {
        await client.connect();
        await client.query('DROP DATABASE IF EXISTS openmusic');
        await client.query('CREATE DATABASE openmusic');
        console.log('Database openmusic reset successfully');
    } catch (err) {
        console.error('Error resetting database:', err);
    } finally {
        await client.end();
    }
}

resetDb();
