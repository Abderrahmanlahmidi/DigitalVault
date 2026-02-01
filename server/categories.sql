INSERT INTO "Category" ("id", "name") VALUES 
(gen_random_uuid(), 'Software & Apps'),
(gen_random_uuid(), 'Game Assets'),
(gen_random_uuid(), '3D Models'),
(gen_random_uuid(), 'Design Templates'),
(gen_random_uuid(), 'UI / UX Kits'),
(gen_random_uuid(), 'Icons & Illustrations'),
(gen_random_uuid(), 'Fonts & Typography'),
(gen_random_uuid(), 'Motion Graphics'),
(gen_random_uuid(), 'Sound Effects & Music'),
(gen_random_uuid(), 'E-books & Tutorials'),
(gen_random_uuid(), 'Code & Scripts'),
(gen_random_uuid(), 'Photography & Textures')
ON CONFLICT ("name") DO NOTHING;
