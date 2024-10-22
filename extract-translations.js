const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const files = ["./src/components/*.jsx","./src/components/aboutUs/*.jsx","./src/components/banner/*.jsx","./src/components/Dashboard/*.jsx","./src/components/event/*.jsx","./src/components/f&q/*.jsx","./src/components/header/*.jsx","./src/components/instruction/*.jsx","./src/components/message/*.jsx","./src/components/portfolio/*.jsx","./src/components/price/*.jsx","./src/pages/*.jsx"]; // Add paths to all components

const extractText = (content) => {
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const translations = {};

  traverse(ast, {
    JSXText(path) {
      const text = path.node.value.trim();
      if (text) {
        translations[text] = text; // Add translation key-value pair
      }
    },
  });

  return translations;
};

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const translations = extractText(content);
  console.log(`Extracted from ${file}:`, translations);

  // Save to JSON or append to existing translation file (e.g., en/common.json)
  fs.writeFileSync(`./locales/en/common.json`, JSON.stringify(translations, null, 2));
});
