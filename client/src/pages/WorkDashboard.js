// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Grid, Container, Typography, Card, Avatar, Stack, Button } from '@mui/material';
// components
import Page from '../components/Page';

import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';



import account from '../_mocks_/account';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({


  justifyContent: 'center',
  padding: theme.spacing(4, 4),

}));


export default function DashboardApp() {
    
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Work Dashboard</Typography>
        </Box>
        <Grid container spacing={3}>
         
          

          <Grid item xs={12} md={6} lg={10}>
            <AppConversionRates />
          </Grid>

      
          <Grid item xs={12} md={6} lg={10}>
            <AppNewsUpdate />
          </Grid>

         

          <Grid item xs={12} md={6} lg={10}>
            <AppTasks />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
