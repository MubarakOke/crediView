const path = require('path');
const fs = require('fs');

const buildDir = path.resolve(__dirname, '../build');
const nextDir = path.join(buildDir, '_next');
const newDir = path.join(buildDir, 'staticfiles'); 

// Create the new directory if it doesn't exist
if (!fs.existsSync(newDir)) {
  fs.mkdirSync(newDir);
}

// Move the _next folder into the new directory
if (fs.existsSync(nextDir)) {
  const newNextDir = path.join(newDir, '_next');
  fs.renameSync(nextDir, newNextDir);
  console.log(`Moved _next folder to ${newNextDir}`);
} else {
  console.log('_next folder does not exist.');
}