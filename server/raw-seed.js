const { Client } = require('pg');
const crypto = require('crypto');

const connectionString = "postgresql://postgres:3MZ44x8iQtV5wU99DlNw@digitalvaultdb.cex0000q4179.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=no-verify";

const categories = [
    'Software & Apps',
    'Game Assets',
    '3D Models',
    'Design Templates',
    'UI / UX Kits',
    'Icons & Illustrations',
    'Fonts & Typography',
    'Motion Graphics',
    'Sound Effects & Music',
    'E-books & Tutorials',
    'Code & Scripts',
    'Photography & Textures'
];

async function seed() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to database.');

        for (const name of categories) {
            const id = crypto.randomUUID();
            await client.query(
                'INSERT INTO "Category" (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
                [id, name]
            );
            console.log(`Inserted: ${name}`);
        }
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await client.end();
    }
}

seed();
