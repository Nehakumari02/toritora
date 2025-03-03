self.addEventListener("push", (event) => {
    const data = event.data.json();
    const title = data.title;
    const body = data.body;
    const icon = data.icon;
    const url = data.data.url;

    const notificationOptions = {
      body: body,
      tag: "unique-tag",
      icon: icon,
      data: {
        url: url,
      },
    };

    self.registration.showNotification(title, notificationOptions);
  });

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event.notification.data);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
})