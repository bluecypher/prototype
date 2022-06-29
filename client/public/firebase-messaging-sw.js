////firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyChK2BgVLUT0qAS4Iia22oLsiy3HpPn72w',
    authDomain: 'sahayak-s.firebaseapp.com',
    projectId: 'sahayak-s',
    storageBucket: 'sahayak-s.appspot.com',
    messagingSenderId: '378636498959',
    appId: '1:378636498959:web:51cd05582427b6e5afcb7a',
    measurementId: 'G-7QF49DGWZ8'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onMessage((payload)=>{
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
        
//     };

//     self.registration.showNotification(notificationTitle,
//         notificationOptions);
// })
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
