INSERT INTO "Category" ("id", "name") VALUES 
('c1', 'Software & Apps'),
('c2', 'Game Assets'),
('c3', '3D Models'),
('c4', 'Design Templates'),
('c5', 'UI / UX Kits'),
('c6', 'Icons & Illustrations'),
('c7', 'Fonts & Typography'),
('c8', 'Motion Graphics'),
('c9', 'Sound Effects & Music'),
('c10', 'E-books & Tutorials'),
('c11', 'Code & Scripts'),
('c12', 'Photography & Textures')
ON CONFLICT ("name") DO NOTHING;
