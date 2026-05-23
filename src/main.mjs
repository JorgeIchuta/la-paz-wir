const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

if (isBrowser) {
  await import("./game-app.mjs");
} else {
  await import("./server/dev-server.mjs");
}
