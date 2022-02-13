import React, { Suspense } from 'react';
// routes
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';


// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Suspense fallback={
      <Box sx={{position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', }}>
      <CircularProgress />
    </Box>
      }>
      <Router />
      </Suspense>
    </ThemeConfig>
  );
}
