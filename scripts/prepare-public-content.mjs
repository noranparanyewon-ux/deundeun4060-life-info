import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../content/article-manifest.json", import.meta.url);
const outputPath = new URL("../client/src/lib/verifiedContent.generated.ts", import.meta.url);
const now = new Date(process.env.PUBLISH_NOW ?? new Date().toISOString());

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const publicArticles = manifest.articles
  .filter((article) => article.publishedAt && new Date(article.publishedAt) <= now)
  .map(({ verification, sources, ...article }) => ({
    ...article,
    publication: "published",
    verification,
    sources,
  }));

if (publicArticles.some((article) => !article.publishedAt || new Date(article.publishedAt) > now)) {
  throw new Error("A future article was included in the public client payload.");
}

await mkdir(new URL("../client/src/lib/", import.meta.url), { recursive: true });
await writeFile(
  outputPath,
  `/* This file is generated from the reviewed manifest. Do not edit by hand. */\nexport const verifiedContent = ${JSON.stringify({ categoryMeta: manifest.categoryMeta, articles: publicArticles }, null, 2)} as const;\n`,
  "utf8",
);
console.log(`Prepared ${publicArticles.length} public articles as of ${now.toISOString()}.`);
