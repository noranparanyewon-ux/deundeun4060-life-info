export type FeatureShareTarget = "x" | "facebook";

function normalizeBasePath(basePath: string) {
  const normalized = basePath.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}/` : "/";
}

export function buildFeatureShareUrl(canonicalPath: string, origin: string, basePath: string) {
  const path = canonicalPath.replace(/^\/+/, "");
  return new URL(path, `${origin.replace(/\/$/, "")}${normalizeBasePath(basePath)}`).toString();
}

export function buildFeatureShareTargets(title: string, articleUrl: string): Record<FeatureShareTarget, string> {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(articleUrl);
  return {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}
