const previewUrl = process.env.PREVIEW_URL || "https://3000-iru92iscm5u270zzbh1yj-cde59949.sg1.manus.computer";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const targets = await fetch("http://127.0.0.1:9222/json/list").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
if (!target) throw new Error("No inspectable browser page was available.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(String(data));
  if (!message.id) return;
  const entry = pending.get(message.id);
  if (!entry) return;
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(message.error.message));
  else entry.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Runtime evaluation failed.");
  return result.result.value;
}

async function navigate(url) {
  await send("Page.navigate", { url });
  await sleep(1000);
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate(previewUrl);

  const initialSlider = await evaluate(`(() => ({ count: document.querySelectorAll('.featured-slider__dots button').length, position: document.querySelector('.featured-slider__controls span')?.textContent, title: document.querySelector('.webzine-cover h1')?.textContent }))()`);
  if (initialSlider.count !== 5 || initialSlider.position !== "1 / 5" || !initialSlider.title) throw new Error("Featured slider did not render all published feature stories.");

  await evaluate(`document.querySelector('button[aria-label="다음 특집 기사"]')?.click()`);
  await sleep(150);
  const buttonSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (buttonSlide !== "2 / 5") throw new Error("Featured slider next control failed.");

  await evaluate(`(() => { const slider = document.querySelector('.featured-slider'); slider?.focus(); slider?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); })()`);
  await sleep(150);
  const keyboardSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (keyboardSlide !== "3 / 5") throw new Error("Featured slider keyboard navigation failed.");

  const sliderPoint = await evaluate(`(() => { const rect = document.querySelector('.featured-slider')?.getBoundingClientRect(); return rect ? { x: Math.round(rect.right - 34), y: Math.round(rect.top + 130) } : null; })()`);
  if (!sliderPoint) throw new Error("Featured slider was not available for touch testing.");
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: sliderPoint.x, y: sliderPoint.y, id: 1 }] });
  await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: sliderPoint.x - 130, y: sliderPoint.y, id: 1 }] });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(180);
  const touchSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (touchSlide !== "4 / 5") throw new Error("Featured slider touch swipe failed.");

  await evaluate(`document.querySelector('button[aria-label="다음 특집 기사"]')?.click()`);
  await sleep(120);
  const fifthSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (fifthSlide !== "5 / 5") throw new Error("Featured slider did not reach the fifth feature story.");

  await evaluate(`document.querySelector('button[aria-label="다음 특집 기사"]')?.click()`);
  await sleep(120);
  const wrappedSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (wrappedSlide !== "1 / 5") throw new Error("Featured slider did not wrap after the fifth story.");

  await evaluate(`document.querySelector('button[aria-label="이전 특집 기사"]')?.click()`);
  await sleep(120);
  const previousSlide = await evaluate(`document.querySelector('.featured-slider__controls span')?.textContent`);
  if (previousSlide !== "5 / 5") throw new Error("Featured slider previous control failed.");

  for (let index = 0; index < 5; index += 1) {
    await evaluate(`document.querySelectorAll('.featured-slider__dots button')[${index}]?.click()`);
    await sleep(100);
    const indicatorState = await evaluate(`(() => ({ position: document.querySelector('.featured-slider__controls span')?.textContent, active: [...document.querySelectorAll('.featured-slider__dots button')].findIndex((button) => button.classList.contains('is-active')) }))()`);
    if (indicatorState.position !== `${index + 1} / 5` || indicatorState.active !== index) throw new Error(`Featured slider indicator ${index + 1} failed.`);
  }

  const initial = await evaluate(`(() => {
    const button = document.querySelector('.menu-toggle');
    return { visible: !!button && getComputedStyle(button).display !== 'none', label: button?.getAttribute('aria-label') };
  })()`);
  if (!initial.visible || initial.label !== "메뉴 열기") throw new Error("Mobile menu trigger was not visible or labelled correctly.");

  await evaluate(`document.querySelector('.menu-toggle')?.click()`);
  await sleep(200);
  const opened = await evaluate(`(() => {
    const nav = document.querySelector('.main-nav');
    return {
      expanded: document.querySelector('.menu-toggle')?.getAttribute('aria-expanded'),
      open: nav?.classList.contains('main-nav--open'),
      overflow: getComputedStyle(document.body).overflow,
      visibleLinks: [...document.querySelectorAll('.mobile-menu-group a')].filter((link) => link.getClientRects().length > 0).length,
      searchVisible: document.querySelector('.mobile-menu-search input')?.getClientRects().length > 0,
    };
  })()`);
  if (opened.expanded !== "true" || !opened.open || opened.overflow !== "hidden" || opened.visibleLinks !== 10 || !opened.searchVisible) throw new Error("Mobile menu did not open with readable navigation, search, and scroll lock.");

  await evaluate(`document.querySelector('.menu-toggle')?.click()`);
  await sleep(160);
  const closed = await evaluate(`(() => ({ open: document.querySelector('.main-nav')?.classList.contains('main-nav--open'), overflow: getComputedStyle(document.body).overflow }))()`);
  if (closed.open || closed.overflow === "hidden") throw new Error("Mobile menu did not close and restore page scrolling.");

  await evaluate(`document.querySelector('.menu-toggle')?.click()`);
  await sleep(120);
  await evaluate(`document.querySelector('.mobile-menu-group a[href="/category/pension"]')?.click()`);
  await sleep(600);
  const categoryNavigation = await evaluate(`({ path: location.pathname, open: document.querySelector('.main-nav')?.classList.contains('main-nav--open') })`);
  if (categoryNavigation.path !== "/category/pension" || categoryNavigation.open) throw new Error("Category navigation from the mobile menu failed.");

  await navigate(previewUrl);
  await evaluate(`document.querySelector('.menu-toggle')?.click()`);
  await sleep(120);
  await evaluate(`(() => { const input = document.querySelector('.mobile-menu-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(input, '연금'); input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('.mobile-menu-search')?.requestSubmit(); })()`);
  await sleep(600);
  const searchNavigation = await evaluate(`({ path: location.pathname, query: new URLSearchParams(location.search).get('q'), open: document.querySelector('.main-nav')?.classList.contains('main-nav--open') })`);
  if (searchNavigation.path !== "/search" || searchNavigation.query !== "연금" || searchNavigation.open) throw new Error("Search submission from the mobile menu failed.");

  console.log("Feature slider and mobile menu interaction test passed: touch, buttons, keyboard, all indicators, wraparound, open/close, scroll lock, category navigation, and search submission.");
} finally {
  socket.close();
}
