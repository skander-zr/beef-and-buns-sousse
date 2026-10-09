import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  
  console.log("Navigating to site...");
  await page.goto('https://per-voi-sousse-2.onrender.com/', { waitUntil: 'networkidle0' });
  
  console.log("Taking initial screenshot...");
  await page.screenshot({ path: path.join(__dirname, 'initial.png') });
  
  console.log("Clicking 'Ajouter' button on first item...");
  // Evaluate to find the first "Ajouter" button and click it
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.textContent && b.textContent.includes('Ajouter'));
    if (addBtn) addBtn.click();
  });
  
  // Wait a moment for state to update
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log("Taking screenshot after adding to cart...");
  await page.screenshot({ path: path.join(__dirname, 'added.png') });
  
  console.log("Clicking floating cart button...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cartBtn = buttons.find(b => b.className.includes('cart-float'));
    if (cartBtn) cartBtn.click();
  });
  
  // Wait for overlay to open or crash to happen
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Taking final screenshot of the cart...");
  await page.screenshot({ path: path.join(__dirname, 'cart.png') });
  
  // Also dump console logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  console.log("Done.");
  await browser.close();
})();
