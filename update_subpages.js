import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = __dirname;

const newNavTemplate = `  <nav class="nav-shell">
    <div class="nav-container">
      <a href="../index.html" class="nav-logo">
        <img src="../Logo.svg" alt="Star Atlas">
      </a>
      <ul class="nav-links">
        <li><a href="../#game" class="nav-link">Game Modes</a></li>
        <li><a href="../#economy" class="nav-link">Economy</a></li>
        <li><a href="../#community" class="nav-link">Community</a></li>
      </ul>
      <a href="https://play.staratlas.com/market/" target="_blank" class="btn btn-secondary">Marketplace</a>
    </div>
  </nav>`;

const newFooterTemplate = `  <footer class="footer reveal">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="../Logo.svg" alt="Star Atlas" width="120">
          <p>Star Atlas is a next-gen gaming metaverse emerging from the confluence of state-of-the-art blockchain, real-time graphics, and multiplayer video game technologies.</p>
        </div>
        <div class="footer-column">
          <h4 class="footer-heading">Community</h4>
          <ul class="footer-links">
            <li><a href="#">X / Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4 class="footer-heading">Support</h4>
          <ul class="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press Kit</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2625 Star Atlas. All rights reserved.</p>
        <div style="display: flex; gap: 1rem;">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </div>
  </footer>`;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        var isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && !dirPath.includes('.git') && !dirPath.includes('src')) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.html') && dir !== targetDir) {
            callback(dirPath);
        }
    });
}

walkDir(targetDir, function (filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace Nav
    const navRegex = /<nav>[\s\S]*?<\/nav>/;
    if (navRegex.test(content)) {
        content = content.replace(navRegex, newNavTemplate);
    }

    // Replace Footer
    const footerRegex = /<footer>[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooterTemplate);
    }

    // Replace specific old loading/glow containers with nothing if we want them out, 
    // but maybe they are fine because they are hidden or empty.

    // The previous CSS had stuff like `feature-page`, so let's just make sure 
    // that the `main` tag still renders well. In our new CSS, `.feature-page` is not defined,
    // so it might lose some padding, but `container` handles it.
    // Let's add `class="container"` to `main` if it does not have it.
    const mainRegex = /<main class="feature-page">/;
    if (mainRegex.test(content)) {
        content = content.replace(mainRegex, '<main class="feature-page container" style="padding-top: 120px;">');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
});
