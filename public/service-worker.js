self.addEventListener("install", () => {
  console.log("Service worker installing...");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
