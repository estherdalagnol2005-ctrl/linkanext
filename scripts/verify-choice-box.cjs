const { chromium } = require("C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright");

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function capture(browser, name, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(() =>
    document.querySelector(".linka-stage")?.classList.contains("is-choice-menu"),
  );
  await page.waitForTimeout(1200);

  const box = page.locator(".linka-choice-content");
  await box.screenshot({ path: `tmp-choice-${name}.png` });

  const styles = await box.evaluate((element) => {
    const boxStyle = getComputedStyle(element);
    const beamStyle = getComputedStyle(element, "::before");
    return {
      width: boxStyle.width,
      padding: boxStyle.padding,
      borderWidth: boxStyle.borderWidth,
      borderRadius: boxStyle.borderRadius,
      animationName: beamStyle.animationName,
      animationDuration: beamStyle.animationDuration,
      maskComposite: beamStyle.maskComposite,
    };
  });

  await context.close();
  return styles;
}

(async () => {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  try {
    const desktop = await capture(browser, "desktop", { width: 1440, height: 900 });
    const mobile = await capture(browser, "mobile", { width: 390, height: 844 });
    console.log(JSON.stringify({ desktop, mobile }, null, 2));
  } finally {
    await browser.close();
  }
})();
