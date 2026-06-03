import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotsDir = path.join(__dirname, '../screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to homepage with demo mode query parameter
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:5173/?demo=true', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Click "Connect Wallet"
    console.log('Connecting wallet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const connectBtn = buttons.find(b => b.textContent.includes('Connect Wallet'));
      if (connectBtn) connectBtn.click();
    });

    // Wait for wallet connection to process
    await new Promise(r => setTimeout(r, 1500));

    // 2. Take Screenshot 1: wallet_connected.png
    console.log('Taking wallet_connected.png screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, 'wallet_connected.png') });

    // 3. Take Screenshot 2: balance_displayed.png
    console.log('Taking balance_displayed.png screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, 'balance_displayed.png') });

    // 4. Input stake amount
    console.log('Setting stake amount...');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="number"]');
      if (input) {
        input.value = '10';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await new Promise(r => setTimeout(r, 500));

    // Click "Lock Stake & Start"
    console.log('Starting focus session...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => b.textContent.includes('Lock Stake & Start'));
      if (startBtn) startBtn.click();
    });

    // 5. Take Screenshot 3: transaction_success.png (during transaction processing or right after start)
    await new Promise(r => setTimeout(r, 500));
    console.log('Taking transaction_success.png screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, 'transaction_success.png') });

    // Wait for the mock transaction to complete and redirect to the focus session page
    await new Promise(r => setTimeout(r, 2000));

    // 6. Let the 10-second countdown session finish, wait 11 seconds to auto-trigger complete refund
    console.log('Waiting for focus session countdown to complete...');
    await new Promise(r => setTimeout(r, 11000));

    // Wait for refund transition to finish and redirect to success page
    await new Promise(r => setTimeout(r, 3000));

    // 7. Take Screenshot 4: transaction_result.png
    console.log('Taking transaction_result.png screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, 'transaction_result.png') });

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error during automation:', error);
  } finally {
    await browser.close();
  }
}

run();
