import puppeteer from 'puppeteer';
const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/cloud-metering-pay/');
  await delay(1000);

  // 1. Calculator
  console.log('Taking screenshot 1...');
  await page.screenshot({ path: '1_calculator.png' });

  // Type numbers
  const inputs = await page.$$('input[type="number"]');
  if (inputs.length >= 2) {
    await inputs[0].type('150');
    await inputs[1].type('200');
  }

  // Click proceed
  const [proceedBtn] = await page.$$("::-p-xpath(//button[contains(., '建立帳戶並結帳')])");
  if (proceedBtn) {
    await proceedBtn.click();
    await delay(1000);
  }

  // 2. Register
  console.log('Taking screenshot 2...');
  await page.screenshot({ path: '2_register.png' });

  // Fill register
  const textInputs = await page.$$('input[type="text"]');
  if (textInputs.length > 0) await textInputs[0].type('Test Company');
  const emailInputs = await page.$$('input[type="email"]');
  if (emailInputs.length > 0) await emailInputs[0].type('admin@test.com');
  const passInputs = await page.$$('input[type="password"]');
  if (passInputs.length > 0) await passInputs[0].type('password123');

  const [registerBtn] = await page.$$("::-p-xpath(//button[contains(., '註冊並前往付款')])");
  if (registerBtn) {
    await registerBtn.click();
    await delay(1000);
  }

  // 3. Checkout
  console.log('Taking screenshot 3...');
  await page.screenshot({ path: '3_checkout.png' });

  // Go to client dashboard directly by clicking 登入 or simulating
  // Actually, wait, going back to calculator then login
  await page.goto('http://localhost:5173/cloud-metering-pay/');
  await delay(500);
  const [loginTabBtn] = await page.$$("::-p-xpath(//button[contains(., '登入')])");
  if (loginTabBtn) {
    await loginTabBtn.click();
    await delay(500);
  }
  
  const emailsLogin = await page.$$('input[type="email"]');
  if (emailsLogin.length > 0) await emailsLogin[0].type('admin@test.com');
  const passesLogin = await page.$$('input[type="password"]');
  if (passesLogin.length > 0) await passesLogin[0].type('password123');
  
  const [loginSubmit] = await page.$$("::-p-xpath(//button[contains(., '登入') and @type='submit'])");
  if (loginSubmit) {
    await loginSubmit.click();
    await delay(1000);
  }

  // 4. Client Dashboard
  console.log('Taking screenshot 4...');
  await page.screenshot({ path: '4_client_dashboard.png' });

  // Click 擴充表位數量
  const [expandBtn] = await page.$$("::-p-xpath(//span[contains(., '擴充表位數量')])");
  if (expandBtn) {
    const parentBtn = await expandBtn.getProperty('parentNode');
    await parentBtn.asElement().click();
    await delay(1000);
    console.log('Taking screenshot 5...');
    await page.screenshot({ path: '5_expand.png' });
  }

  // Click 立即手動續約
  // Go back to dashboard first
  const [backBtn] = await page.$$("::-p-xpath(//h1[contains(., '擴充表位數量')]/preceding-sibling::button)");
  if (backBtn) {
    await backBtn.click();
    await delay(1000);
  }

  const [renewBtn] = await page.$$("::-p-xpath(//button[contains(., '立即手動續約')])");
  if (renewBtn) {
    await renewBtn.click();
    await delay(1000);
    console.log('Taking screenshot 6...');
    await page.screenshot({ path: '6_renew.png' });
  }

  // Admin dashboard
  const [adminSwitch] = await page.$$("::-p-xpath(//button[contains(., '切換至員工後台')])");
  if (adminSwitch) {
    await adminSwitch.click();
    await delay(1000);
    console.log('Taking screenshot 7...');
    await page.screenshot({ path: '7_admin.png' });
  }

  await browser.close();
  console.log('Done.');
})();
