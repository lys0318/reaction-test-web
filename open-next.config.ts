import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (SSG) with no ISR/revalidation, so prerendered
// pages are served straight from Workers static assets. Without an incremental
// cache configured, OpenNext cannot retrieve prerendered pages at runtime and
// returns 404 for every app-router page.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
