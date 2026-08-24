const CACHE_NAME = "biblia-sagrada-v1"

const STATIC_ASSETS = [
  "/",
  "/favicon.svg",
  "/favicon.ico",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Cache-first para assets estáticos e dados da Bíblia
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.includes(".json")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Network-first para navegação (páginas)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    )
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const client = clientsArr.find((c) => "focus" in c)
      if (client) return client.focus()
      return self.clients.openWindow("/")
    })
  )
})
