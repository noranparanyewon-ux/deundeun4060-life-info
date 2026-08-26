import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../content/article-manifest.json", import.meta.url);
const outputPath = new URL("../client/src/lib/verifiedContent.generated.ts", import.meta.url);
const now = new Date(process.env.PUBLISH_NOW ?? new Date().toISOString());

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const imagesByCategory = {
  welfare: "/manus-storage/deundeun4060-hero_a6a96565.png",
  pension: "/manus-storage/deundeun4060-pension-editorial_a026a98e.jpg",
  health: "/manus-storage/deundeun4060-health-editorial_80d63336.jpg",
  saving: "/manus-storage/deundeun4060-saving-editorial_d0d673d0.jpg",
};

const publicArticles = manifest.articles
  .filter((article) => article.publication === "published" || new Date(article.publishedAt) <= now)
  .map(({ verification, sources, ...article }) => ({
    ...article,
    publication: "published",
    image: imagesByCategory[article.category],
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
