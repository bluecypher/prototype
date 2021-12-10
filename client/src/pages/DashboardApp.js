// material

import { alpha, styled } from '@mui/material/styles';
import React,{ useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Grid, Container, Typography, Card, Avatar, Stack, Button, Link } from '@mui/material';
import { useDispatch } from "react-redux";
import { addProfile } from '../actions/index';

// components
import Page from '../components/Page';

const axios = require('axios');

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



// import account from '../_mocks_/account';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({


  justifyContent: 'center',
  padding: theme.spacing(4, 4),

}));


 const DashboardApp = ({profile}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [img, setImg] = useState();
  const [number, setNumber] = useState('');
  const [cookies, setCookies] = useCookies('');

  const dispatch = useDispatch();
  useEffect(() => {
    async function foo() {
      setNumber(localStorage.getItem('number'));
      const res = await axios.get('http://localhost:5000/users/getData', {  params: { 'number': localStorage.getItem('number'),'Cookies':cookies } })
        // .then((res) => {
          console.log('img data', res.data[0]);
          const bufferOriginal = Buffer.from(res.data[0].img.data);
          // console.log('img data', bufferOriginal.toString('utf8'));
          dispatch(addProfile([res.data[0].name, localStorage.getItem('number'), bufferOriginal.toString('utf8')]));
          setName(res.data[0].name);
          setImg(bufferOriginal.toString('utf8'));
        
        // .catch((err) => {
        //   console.log('err', err);
        // });

    }
    foo();
  });
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <RootStyle>
              <Avatar src={img} sx={{ width: 150, height: 150, alignSelf: 'center' }} alt="photoURL" />
            </RootStyle>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Stack sx={{ justifyContent: 'center', marginTop: 5 }} spacing={2}>
              <Typography variant="h4">{name}</Typography>
              <Typography variant="h4">{number}</Typography>

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
                Sign in
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


export default DashboardApp;