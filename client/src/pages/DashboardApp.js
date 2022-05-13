// material

import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Container, Typography, Card, Avatar, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addProfile } from '../actions/index';

// components
import Page from '../components/Page';
// import ConstLang from '../components/ConstLang';

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
  padding: theme.spacing(4, 4)
}));

const DashboardApp = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies('');

  const data = useSelector((state) => state.profileReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    const num = localStorage.getItem('number');
    console.log('data', num);
    axios
      .get('/users/getData', { params: { number: num } })

      .then((res) => {
        console.log('data', res.data);
        if (Object.keys(cookies).length) {
          console.log('data', res.data[0].photo);
          let bufferOriginal = null;
          if (res.data[0].photo) {
            if (res.data[0].photo.data) {
              bufferOriginal = Buffer.from(res.data[0].photo.data);
              // setImg(bufferOriginal.toString('utf8'));
            }
          }
          let logoBuffer = null;
          if (res.data[0].ent_logo) {
            if (res.data[0].ent_logo.data) {
              logoBuffer = Buffer.from(res.data[0].ent_logo.data);
              // setImg(bufferOriginal.toString('utf8'));
            }
          }
          console.log('img data', logoBuffer ? logoBuffer.toString('utf8') : 'no logo');
          dispatch(
            addProfile([
              res.data[0].first_name,
              res.data[0].last_name,
              localStorage.getItem('number'),
              bufferOriginal ? bufferOriginal.toString('utf8') : null,
              res.data[0].email,
              res.data[0].address1,
              res.data[0].address2,
              res.data[0].city,
              res.data[0].pin,
              res.data[0].state,
              res.data[0].locality_of_work,
              res.data[0].highlights,
              res.data[0].enterprise,
              res.data[0].user_mast_id,
              res.data[0].user_type,
              logoBuffer ? logoBuffer.toString('utf8') : null,
              res.data[0].ent_id,
              res.data[0].vpa,
            ])
          );
          const fullName = `${res.data[0].first_name} ${res.data[0].last_name}`;
          const obj = JSON.stringify({
            number: localStorage.getItem('number'),
            name: fullName,
            image: bufferOriginal ? bufferOriginal.toString('utf8') : null
          });
          console.log(obj);
          localStorage.setItem('prev_user', obj);
        } else {
          navigate('/sessionExpired');
        }
      })
      .then(() => {
        setTimeout(() => {
          console.log('Welcome!');
          navigate('/dashboard/work');
        }, 2000);
      })

      .catch((err) => {
        console.log('err', err);
      });

    // foo();
  }, [localStorage.getItem('number')]);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome Back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} align="center">
            <RootStyle>
              {data.img ? (
                <Avatar
                  src={data.img}
                  sx={{ width: 150, height: 150, alignSelf: 'center' }}
                  alt="photoURL"
                />
              ) : (
                <Avatar sx={{ width: 150, height: 150, alignSelf: 'center' }} alt="photoURL" />
              )}
            </RootStyle>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Stack
              sx={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}
              spacing={2}
            >
              <Typography variant="h4">
                {data.fname} {data.lname}
              </Typography>
              <Typography variant="h4">{data.number}</Typography>
            </Stack>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <Link component={RouterLink} to="/dashboard/work">
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"

              >
                Proceed
              </Button>
            </Link>
          </Grid> */}
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
};

export default DashboardApp;
