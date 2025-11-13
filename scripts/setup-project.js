import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function renameProject(projectDir, newName, newSlug) {

  // File cần cập nhật
  const filesToUpdate = [
    'app.json',
    'package.json'
  ];

  filesToUpdate.forEach(file => {
    const filePath = path.join(projectDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File không tồn tại: ${file}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (file === 'app.json') {
        const appConfig = JSON.parse(content);
        
        // Cập nhật app.json
        appConfig.expo.name = newName;
        appConfig.expo.slug = newSlug;
        appConfig.expo.scheme = newSlug;
        
        // Xóa các trường liên quan đến project cũ
        delete appConfig.expo.extra?.eas?.projectId;
        delete appConfig.expo.owner;
        delete appConfig.expo.updates?.url;
        
        content = JSON.stringify(appConfig, null, 2);
      }
      
      if (file === 'package.json') {
        const packageJson = JSON.parse(content);
        packageJson.name = newSlug;
        content = JSON.stringify(packageJson, null, 2);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      
    } catch (error) {
      console.error(`❌ Lỗi khi xử lý file ${file}:`, error.message);
    }
  });

}

async function main() {
  const nameInput = await ask('Nhập tên project: ');
  const name = nameInput.trim().toLowerCase().replace(/\s+/g, '-');

  renameProject('./', name, name);

  rl.close();
}

main();
