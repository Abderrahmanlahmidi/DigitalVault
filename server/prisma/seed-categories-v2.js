const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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

    console.log('Seeding real categories for DigitalVault...');

    // Use a transaction or loop to upsert
    for (const name of categories) {
        const category = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        console.log(`- ${category.name}`);
    }

    console.log('Categories seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding categories:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
