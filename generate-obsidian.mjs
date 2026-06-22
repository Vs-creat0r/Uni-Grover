import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src', 'src'); // According to the logs, it's D:\SDLC\projects\Uni-Grover\src\src
const OUTPUT_DIR = path.join(process.cwd(), 'obsidian-vault');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getFileNameWithoutExtension(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

// Format the file path into a readable Obsidian node name
function getObsidianNodeName(filePath) {
  // e.g. "app/dashboard/live/page.tsx" -> "Dashboard Live Page"
  let relPath = path.relative(SRC_DIR, filePath);
  relPath = relPath.replace(/\\/g, '/');
  
  // Clean up standard Next.js names
  if (relPath.endsWith('/page.tsx')) relPath = relPath.replace('/page.tsx', ' Page');
  if (relPath.endsWith('/route.ts')) relPath = relPath.replace('/route.ts', ' API Route');
  if (relPath.endsWith('/layout.tsx')) relPath = relPath.replace('/layout.tsx', ' Layout');
  
  relPath = relPath.replace('.tsx', '').replace('.ts', '').replace('.css', ' CSS');
  
  // Capitalize and format
  return relPath.split('/').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).replace(/-/g, ' ');
  }).join(' ');
}

function extractImports(content) {
  const imports = [];
  // Match standard ES6 imports: import { Something } from './path'
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function traverseDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function resolveImportPath(currentFilePath, importPath, allFiles) {
  // Only care about local imports
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    // It's a third-party module (e.g. 'react', 'lucide-react')
    return `Lib ${importPath}`;
  }

  // Resolve @/ to src/
  let absoluteImportPath;
  if (importPath.startsWith('@/')) {
    absoluteImportPath = path.join(SRC_DIR, importPath.replace('@/', ''));
  } else {
    absoluteImportPath = path.join(path.dirname(currentFilePath), importPath);
  }

  // Find the actual file it points to
  const possibleFiles = [
    absoluteImportPath + '.ts',
    absoluteImportPath + '.tsx',
    absoluteImportPath + '.css',
    path.join(absoluteImportPath, 'index.ts'),
    path.join(absoluteImportPath, 'index.tsx')
  ];

  for (const pFile of possibleFiles) {
    if (allFiles.includes(pFile) || fs.existsSync(pFile)) {
      return getObsidianNodeName(pFile);
    }
  }
  
  return path.basename(importPath); // Fallback
}

console.log("Scanning project files...");
const allFiles = traverseDirectory(SRC_DIR);
console.log(`Found ${allFiles.length} files. Generating Obsidian vault...`);

for (const file of allFiles) {
  const nodeName = getObsidianNodeName(file);
  const content = fs.readFileSync(file, 'utf-8');
  const imports = extractImports(content);
  
  let mdContent = `# ${nodeName}\n\n`;
  mdContent += `**File:** \`${path.relative(process.cwd(), file)}\`\n\n`;
  
  if (imports.length > 0) {
    mdContent += `## Dependencies\n`;
    for (const imp of imports) {
      const resolvedNode = resolveImportPath(file, imp, allFiles);
      // Create link
      mdContent += `- [[${resolvedNode}]]\n`;
    }
  }

  // Ensure invalid characters for filenames are removed
  const safeFilename = nodeName.replace(/[<>:"/\\|?*]/g, '') + '.md';
  fs.writeFileSync(path.join(OUTPUT_DIR, safeFilename), mdContent);
}

// Create a central Hub node
let hubContent = `# Uni-Grover Architecture Hub\n\nThis is the central hub connecting all major components of your project.\n\n## Pages\n`;
const pages = allFiles.filter(f => f.endsWith('page.tsx')).map(getObsidianNodeName);
pages.forEach(p => hubContent += `- [[${p}]]\n`);

hubContent += `\n## APIs\n`;
const apis = allFiles.filter(f => f.endsWith('route.ts')).map(getObsidianNodeName);
apis.forEach(a => hubContent += `- [[${a}]]\n`);

fs.writeFileSync(path.join(OUTPUT_DIR, 'Uni-Grover Architecture Hub.md'), hubContent);

console.log(`Successfully generated Obsidian vault at: ${OUTPUT_DIR}`);
