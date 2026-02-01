const { PrismaClient } = require('@prisma/client');

async function run() {
    const prisma = new PrismaClient();
    try {
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

        for (const name of categories) {
            await prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }
        console.log('Done');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

run();
