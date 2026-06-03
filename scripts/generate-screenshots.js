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
    
    // Log console and errors from page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    // Navigate to homepage with demo mode query parameter
    console.log('Navigating to homepage with ?demo=true...');
    await page.goto('http://localhost:5173/?demo=true', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Click "Connect Wallet" on the Landing page
    console.log('Clicking Connect Wallet button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const connectBtn = buttons.find(b => b.textContent.includes('Connect Wallet'));
      if (connectBtn) connectBtn.click();
    });

    // Wait 2 seconds for wallet connection
    await new Promise(r => setTimeout(r, 2000));

    // Fallback: Navigate directly to /dashboard to bypass router pathname/history delay
    console.log('Navigating directly to /dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });

    // Wait for the mock balance to load
    console.log('Waiting for balance (12,345.6789) to display on dashboard...');
    await page.waitForFunction(() => {
      return document.body.innerText.includes('12,345.6789');
    }, { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500)); // wait for layout/animations to fully settle

    // 2. Take Screenshot 1: wallet_connected.png (showing dashboard page with connected address in navbar)
    console.log('Taking wallet_connected.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'wallet_connected.png') });

    // 3. Take Screenshot 2: balance_displayed.png (showing the balance display card)
    console.log('Taking balance_displayed.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'balance_displayed.png') });

    // 4. Input stake amount using native descriptor update to trigger React state correctly
    console.log('Setting stake amount to 10 XLM...');
    await page.evaluate(() => {
      const input = document.querySelector('input[inputmode="decimal"]') || document.querySelector('input');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(input, '10');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error('Stake input field NOT found!');
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // Click "Lock Stake & Start"
    console.log('Clicking Lock Stake & Start...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => b.textContent.includes('Lock Stake & Start'));
      if (startBtn) {
        startBtn.click();
      } else {
        console.error('Lock Stake & Start button NOT found or disabled!');
      }
    });

    // Wait for navigation/redirection to the /focus page
    console.log('Waiting for transition to /focus page...');
    await page.waitForFunction(() => window.location.pathname.includes('/focus'), { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500)); // let countdown render

    // 5. Take Screenshot 3: transaction_success.png (showing focus timer and Locked Stake proof link)
    console.log('Taking transaction_success.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'transaction_success.png') });

    // 6. Wait for the 10-second countdown to complete and redirect to /success
    console.log('Waiting for focus session countdown and auto-redirect to /success page...');
    await page.waitForFunction(() => window.location.pathname.includes('/success'), { timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000)); // let confetti animations settle

    // 7. Take Screenshot 4: transaction_result.png (showing success page with refund proofs)
    console.log('Taking transaction_result.png...');
    await page.screenshot({ path: path.join(screenshotsDir, 'transaction_result.png') });

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error during automation:', error);
  } finally {
    await browser.close();
  }
}

run();
