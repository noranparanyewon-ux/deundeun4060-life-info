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

  console.log("Mobile menu interaction test passed: open, close, scroll lock, category navigation, and search submission.");
} finally {
  socket.close();
}
