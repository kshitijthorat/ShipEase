const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = JSON.parse(fs.readFileSync('screens.json', 'utf8'));
const pagesDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

function htmlToJsx(html) {
  // Very basic conversion
  let jsx = html;
  
  // Replace class= with className=
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for= with htmlFor=
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Close unclosed tags like img, input, hr, br, path, svg, etc (simplified)
  jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
  jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  
  // Fix inline styles
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styles = styleString.split(';').filter(s => s.trim().length > 0).reduce((acc, curr) => {
      let [key, value] = curr.split(':');
      if (!key || !value) return acc;
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      acc[key] = value.trim();
      return acc;
    }, {});
    return `style={${JSON.stringify(styles)}}`;
  });

  // Fix SVG props
  jsx = jsx.replace(/viewbox/g, 'viewBox');
  jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
  jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');
  jsx = jsx.replace(/fill-rule/g, 'fillRule');
  jsx = jsx.replace(/clip-rule/g, 'clipRule');
  jsx = jsx.replace(/preserveaspectratio/g, 'preserveAspectRatio');
  jsx = jsx.replace(/stroke-dasharray/g, 'strokeDasharray');

  return jsx;
}

async function downloadAndProcess() {
  for (const screen of screens) {
    console.log(`Processing ${screen.name}...`);
    
    await new Promise((resolve, reject) => {
      https.get(screen.url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Extract body content
          const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          if (bodyMatch) {
            let bodyContent = bodyMatch[1];
            
            // Remove script tags from body
            bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            
            let jsxContent = htmlToJsx(bodyContent);
            
            const componentCode = `import React from 'react';\n\nexport default function ${screen.filename}() {\n  return (\n    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">\n      ${jsxContent}\n    </div>\n  );\n}\n`;
            
            fs.writeFileSync(path.join(pagesDir, `${screen.filename}.jsx`), componentCode);
            console.log(`Saved ${screen.filename}.jsx`);
            resolve();
          } else {
            console.log(`No body found for ${screen.name}`);
            resolve();
          }
        });
      }).on('error', reject);
    });
  }
}

downloadAndProcess().catch(console.error);
