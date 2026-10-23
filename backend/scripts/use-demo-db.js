const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "database", "demo", "data.db");
const targetDir = path.join(__dirname, "..", ".tmp");
fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, path.join(targetDir, "data.db"));
console.log("Base de démonstration copiée dans backend/.tmp/data.db");
