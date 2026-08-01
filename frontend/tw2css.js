// const fs = require('fs');

// try {
//   const config = require('./tw_extracted.js');
//   let themeCss = '@theme {\n';
  
//   if (config.theme && config.theme.extend) {
//     const ext = config.theme.extend;
    
//     if (ext.colors) {
//       for (const [k, v] of Object.entries(ext.colors)) {
//         themeCss += `  --color-${k}: ${v};\n`;
//       }
//     }
    
//     if (ext.borderRadius) {
//       for (const [k, v] of Object.entries(ext.borderRadius)) {
//         if (k === 'DEFAULT') {
//           themeCss += `  --radius: ${v};\n`;
//         } else {
//           themeCss += `  --radius-${k}: ${v};\n`;
//         }
//       }
//     }
    
//     if (ext.spacing) {
//       for (const [k, v] of Object.entries(ext.spacing)) {
//         themeCss += `  --spacing-${k}: ${v};\n`;
//       }
//     }
    
//     if (ext.fontFamily) {
//       for (const [k, v] of Object.entries(ext.fontFamily)) {
//         themeCss += `  --font-${k}: "${v[0]}", sans-serif;\n`;
//       }
//     }
    
//     // In tailwind v4, text-* utilities for sizes map to --text-*
//     if (ext.fontSize) {
//       for (const [k, v] of Object.entries(ext.fontSize)) {
//         themeCss += `  --text-${k}: ${v[0]};\n`;
//         themeCss += `  --text-${k}--line-height: ${v[1].lineHeight || 'normal'};\n`;
//         if (v[1].letterSpacing) {
//            themeCss += `  --text-${k}--letter-spacing: ${v[1].letterSpacing};\n`;
//         }
//         if (v[1].fontWeight) {
//            themeCss += `  --text-${k}--font-weight: ${v[1].fontWeight};\n`;
//         }
//       }
//     }
//   }
  
//   themeCss += '}\n\n';
  
//   const extractedStyles = fs.readFileSync('extracted_styles.css', 'utf-8');
//   themeCss += extractedStyles + '\n';
  
//   fs.appendFileSync('src/app/globals.css', themeCss);
//   console.log('Successfully updated globals.css');
// } catch(e) {
//   console.error(e);
// }
