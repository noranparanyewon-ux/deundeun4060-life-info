import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const basePath = process.env.VITE_BASE_PATH ?? "/deundeun4060-life-info/";
const normalizedBasePath = `${basePath.replace(/\/?$/, "/")}`;
const expectedPrefix = "/deundeun4060-life-info/";
const projectRoot = new URL("../", import.meta.url).pathname;
const generatedContent = readFileSync(new URL("../client/src/lib/verifiedContent.generated.ts", import.meta.url), "utf8");
const distRoot = join(projectRoot, "dist/public");
const indexHtml = readFileSync(join(distRoot, "index.html"), "utf8");
const assetDirectory = join(distRoot, "assets");
const assetBundles = readdirSync(assetDirectory).filter((file) => file.endsWith(".js"));
const bundleSource = assetBundles.map((file) => readFileSync(join(assetDirectory, file), "utf8")).join("\n");
const editorialPaths = [...generatedContent.matchAll(/"image": "(editorial\/[a-z0-9-]+\.svg)"/g)].map((match) => match[1]);

if (normalizedBasePath !== expectedPrefix) {
  throw new Error(`Expected GitHub Pages base path ${expectedPrefix}, received ${normalizedBasePath}.`);
}

if (editorialPaths.length !== 12 || new Set(editorialPaths).size !== 12) {
  throw new Error(`Expected 12 distinct public editorial image paths, received ${editorialPaths.length}.`);
}

for (const assetPath of editorialPaths) {
  const resolvedPath = `${normalizedBasePath}${assetPath}`;
  if (!resolvedPath.startsWith(`${expectedPrefix}editorial/`)) {
    throw new Error(`Image URL is not repository-path-safe: ${resolvedPath}`);
  }
  if (!existsSync(join(distRoot, assetPath))) {
    throw new Error(`Built image asset is missing: ${assetPath}`);
  }
}

if (!indexHtml.includes(expectedPrefix) || !bundleSource.includes(expectedPrefix)) {
  throw new Error("The GitHub Pages repository base path is missing from the built output.");
}

if (/\/manus-storage\//.test(indexHtml) || /\/manus-storage\//.test(bundleSource)) {
  throw new Error("Project-only manuscript storage paths were found in the GitHub Pages build.");
}

console.log(`Verified ${editorialPaths.length} editorial images resolve under ${expectedPrefix}editorial/.`);
