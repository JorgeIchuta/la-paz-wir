const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

if (isBrowser) {
  await import("../game.js");
} else {
  await import("./dev-server.mjs");
}
