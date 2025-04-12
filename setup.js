
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, 'package.json');

try {
  // Read the package.json file
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  let updated = false;

  // Add the dev script if it doesn't exist
  if (!packageJson.scripts.dev) {
    packageJson.scripts.dev = 'expo start';
    console.log('Added "dev" script to package.json');
    updated = true;
  }

  // Add the build:dev script if it doesn't exist
  if (!packageJson.scripts['build:dev']) {
    packageJson.scripts['build:dev'] = 'vite build --mode development';
    console.log('Added "build:dev" script to package.json');
    updated = true;
  }

  // Write the updated package.json only if changes were made
  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Successfully updated package.json');
    console.log('Now you can run "npm run dev" or "npm run build:dev"');
  } else {
    console.log('No changes needed to package.json');
  }

} catch (error) {
  console.error('Error updating package.json:', error);
}
