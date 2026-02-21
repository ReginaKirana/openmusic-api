const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'migrations');
const files = fs.readdirSync(migrationsDir);

for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const filePath = path.join(migrationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/exports\.shorthands\s*=\s*undefined;\n*/g, '');
    content = content.replace(/type:\s*'TEXT'/g, "type: 'VARCHAR(255)'");

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Migrations fixed');
