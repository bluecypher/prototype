import React, { Suspense, useEffect } from 'react';
// routes
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import firebase from "firebase/compat/app";
import { firebaseConfig } from "./utils/pushNotification"

import "firebase/compat/messaging";
import Router from './routes';



// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';


// ----------------------------------------------------------------------



export default function App() {
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);

      const temp = new Notification(payload.notification.title, { body: payload.notification.body });
      // self.registration.showNotification(payload.notification.title, { body: payload.notification.body })
      // ...
    });
  }
  );

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Suspense fallback={
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <CircularProgress />
        </Box>
      }>
        <Router />
      </Suspense>
    </ThemeConfig>
  );
}
