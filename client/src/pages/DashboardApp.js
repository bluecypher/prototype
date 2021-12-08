// material
import { alpha, styled } from '@mui/material/styles';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Grid, Container, Typography, Card, Avatar, Stack, Button, Link } from '@mui/material';
// components
import Page from '../components/Page';

// import {
//   AppTasks,
//   AppNewUsers,
//   AppBugReports,
//   AppItemOrders,
//   AppNewsUpdate,
//   AppWeeklySales,
//   AppOrderTimeline,
//   AppCurrentVisits,
//   AppWebsiteVisits,
//   AppTrafficBySite,
//   AppCurrentSubject,
//   AppConversionRates
// } from '../components/_dashboard/app';



import account from '../_mocks_/account';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({


  justifyContent: 'center',
  padding: theme.spacing(4, 4),

}));


export default function DashboardApp() {
  const navigate=useNavigate();
  
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyle>
              <Avatar src={account.photoURL} sx={{ width: 150, height: 150, alignSelf: 'center' }} alt="photoURL" />
            </RootStyle>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Stack sx={{ justifyContent: 'center', marginTop: 5 }} spacing={2}>
              <Typography variant="h4">{account.displayName}</Typography>
              <Typography variant="h4">{account.number}</Typography>
              
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6} lg={8}>
          <Link component={RouterLink} to="/dashboard/work">
          <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                
              >
                Continue
              </Button>
              </Link>
          </Grid>
          {/* 
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>

          

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
