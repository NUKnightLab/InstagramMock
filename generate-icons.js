const fs = require('fs');
const path = require('path');
const svg2img = require('svg2img');

const SVG_PATH = path.join(__dirname, 'icons', 'Instagram_app_logo.svg');
const ICON_SIZES = [16, 32, 64, 128, 256, 512, 1024];
const OUTPUT_DIR = path.join(__dirname, 'build', 'icons');

// Make sure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read the SVG file
const svgContent = fs.readFileSync(SVG_PATH, 'utf8');

// Generate PNG files for each size
ICON_SIZES.forEach((size) => {
  console.log(`Generating ${size}x${size} icon...`);
  
  svg2img(svgContent, { width: size, height: size }, (error, buffer) => {
    if (error) {
      console.error(`Error generating ${size}x${size} icon:`, error);
      return;
    }
    
    const outputPath = path.join(OUTPUT_DIR, `${size}.png`);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Created ${outputPath}`);
  });
});

// Also create icon.png (1024x1024) and icon.icns for macOS (symlink to 1024.png for now)
console.log('Generating main icon.png...');
svg2img(svgContent, { width: 1024, height: 1024 }, (error, buffer) => {
  if (error) {
    console.error('Error generating main icon:', error);
    return;
  }
  
  const iconPngPath = path.join(OUTPUT_DIR, 'icon.png');
  fs.writeFileSync(iconPngPath, buffer);
  console.log(`Created ${iconPngPath}`);
}); 