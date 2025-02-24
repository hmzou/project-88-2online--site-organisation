importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Initialiser Firebase dans le service worker (avec la même configuration que dans index.html)
firebase.initializeApp({
  apiKey: "AIzaSyBR4jNfaNy9A1q2pYYBElUYIYJnrFaWwwU",
  authDomain: "sitepote.firebaseapp.com",
  projectId: "sitepote",
  storageBucket: "sitepote.firebasestorage.app",
  messagingSenderId: "270750397024",
  appId: "1:270750397024:web:d1edc81ed7db763cfe4905",
  measurementId: "G-J3KQ481721"
});

const messaging = firebase.messaging();

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Message reçu en background :", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
