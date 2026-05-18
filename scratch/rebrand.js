const fs = require('fs');
const path = require('path');

const directoryToScan = path.join(__dirname, '../src');

const replacements = [
  { search: /Lizzy's Beauty Studio/g, replace: "Pretty Chi Hairs" },
  { search: /LIZZY'S BEAUTY STUDIO/g, replace: "PRETTY CHI HAIRS" },
  { search: /LIZZY&apos;S BEAUTY STUDIO/g, replace: "PRETTY CHI HAIRS" },
  { search: /Lizzy&apos;s Beauty Studio/g, replace: "Pretty Chi Hairs" },
  { search: /Lizzy's Studio/g, replace: "Pretty Chi Hairs" },
  { search: /Lizzy&apos;s Studio/g, replace: "Pretty Chi Hairs" },
  { search: /Lizzy/g, replace: "Pretty Chi Hairs" },
  { search: /hello@lizzysbeautystudio.com/g, replace: "hello@prettychihairs.com" },
  { search: /admin@lizzystudio.com/g, replace: "admin@prettychihairs.com" },
  { search: /lizzystudio-cart/g, replace: "prettychihairs-cart" }
];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && /\.(tsx|ts|js|json|css)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const rep of replacements) {
        if (rep.search.test(content)) {
          content = content.replace(rep.search, rep.replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Rebranded: ${path.relative(directoryToScan, fullPath)}`);
      }
    }
  }
}

console.log("Starting rebranding replacements in src/...");
scanDirectory(directoryToScan);
console.log("Rebranding completed!");
