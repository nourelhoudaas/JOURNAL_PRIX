const fs = require('fs');
const path = require('path');

const from = path.resolve(__dirname, '..', 'backend', 'public', 'build', '.vite', 'manifest.json');
const to = path.resolve(__dirname, '..', 'backend', 'public', 'build', 'manifest.json');

console.log('📦 Copie du manifest depuis :', from);
console.log('➡️ Vers :', to);

fs.copyFile(from, to, (err) => {
  if (err) {
    console.error('❌ Échec de la copie du manifest :', err.message);
  } else {
    console.log('✅ Manifest.json copié avec succès.');
  }
});
