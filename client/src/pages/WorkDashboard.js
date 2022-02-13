// material
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Box, Grid, Container, Typography, Card, Stack, Button, CardHeader, Link, TextField } from '@mui/material';
import axios from 'axios';
import DatePicker from '@mui/lab/MobileDatePicker';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
// import frLocale from 'date-fns/locale/fr';
// components
import { Icon } from '@iconify/react';

import Page from '../components/Page';

// import {
//   AppTasks,

//   AppNewsUpdate,

//   AppConversionRates
// } from '../components/_dashboard/app';



export default function DashboardApp() {
  const navigate = useNavigate();

  const [cookies, setCookies] = useCookies();
  const data = useSelector((state) => state.profileReducer);
  const [workList, setWorkList] = useState([]);
  const [histList, setHistList] = useState([]);
  const [date, setDate] = useState(new Date());
  useEffect(() => {

    if (!Object.keys(cookies).length) {
      navigate('/sessionExpired')

    }
    else {
      console.log('ud', date);
      axios.post('http://localhost:5000/users/getTodaysWork', { 'id': data.id, "date": date })
        .then((res) => {
          console.log('res.data', res.data);
          const workTemp = res.data.filter((item) => item.status === 'O');
          const histTemp = res.data.filter((item) => item.status === 'C');

          setWorkList(workTemp);
          setHistList(histTemp);
        })
    }
  }, [data.id, date])
  const addCalls = () => {
    // console.log("click")
    navigate("/dashboard/newcalls");
  };
  const onPhoneClick = (event, id) => {


    navigate(`/dashboard/work/${id}`);
  }
  const editCalls = (event, id) => {
    navigate(`/dashboard/editCalls/${id}`);
  }
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Work Dashboard</Typography>
            <Stack alignItems="flex-end">
              <Button alignSelf="right" onClick={addCalls}><Typography variant="h6">+Add calls</Typography></Button>
            </Stack>
          </Stack>
        </Box>
        <Stack sx={{ pb: 1 }} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => {
                console.log("date:", format(new Date(newValue), 'dd MMM yyyy HH:mm'));
                setDate(newValue);

              }}

              renderInput={(params) => 
                // console.log(params);
                <TextField size="small" {...params} />}
              inputFormat='dd MMM, yyyy'
              // onMonthChange={console.log('sc')}
            />
          </LocalizationProvider>
        </Stack>
        <Grid container spacing={3}>



          <Grid item xs={12} md={6} lg={10}>
            <Typography label="abd"/>
            <Card>
              <CardHeader sx={{ mb: 2 }} title="Planned Calls"
              />

              <Box sx={{ mx: 2, mb: 2, overflow: 'auto', maxHeight: 250, }} dir="ltr">

                {workList.length > 0 ?
                  workList.map((item) => (
                    // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                    <Grid key={item.work_id} sx={{ mb: 1, }} container spacing={2}>
                      <Grid item xs={6} >
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(event) => onPhoneClick(event, item.work_id)}
                        >
                          <Typography variant="subtitle2">{item.name}</Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={2} >
                        <Link href={`tel:${item.cust_phone}`}><Icon icon="ph:phone-call-light" width={22} height={22} /></Link>
                      </Grid>
                      <Grid item xs={2} >
                        <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}><Icon icon="logos:whatsapp" width={22} height={22} /></Link>
                      </Grid>
                      {
                        data.user_type === 'O' ?

                          <Grid item xs={2} >
                            <Link
                              component="button"
                              variant="body2"
                              onClick={(event) => editCalls(event, item.work_id)}
                            >
                              <Icon icon="lucide:pencil" width={20} height={20} />
                            </Link>
                          </Grid>
                          :
                          <></>
                      }
                    </Grid>
                  ))
                  :
                  <Stack alignItems="center" sx={{ xs: 2, lg: 5, maxHeight: 300, overflow: 'auto' }}>

                    <Typography variant="subtitle1">No calls planned for the date!!</Typography>
                  </Stack>
                }
              </Box >
            </Card >

            <Card sx={{ my: 1 }}>
              <CardHeader sx={{ mb: 2 }} title="Calls made"
              />
              <Box sx={{ mx: 2, mb: 2, overflow: 'auto', maxHeight: 250, }} dir="ltr">
                {histList.length > 0 ?
                  histList.map((item) => (
                    // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                    <Grid key={item.work_id} sx={{ mb: 1, }} container spacing={2}>
                      <Grid item xs={8} >
                        {/* <Link
                          component="button"
                          variant="body2"
                          onClick={(event) => onPhoneClick(event, item.work_id)}
                        > */}
                        <Typography variant="subtitle2">{item.name}</Typography>
                        {/* </Link> */}
                      </Grid>
                      <Grid item xs={2} >
                        <Link href={`tel:${item.cust_phone}`}><Icon icon="ph:phone-call-light" width={24} height={24} /></Link>
                      </Grid>

                    </Grid>
                  ))
                  :
                  <Stack alignItems="center" sx={{ xs: 2, lg: 5 }}>
                    <Typography variant="subtitle1">No calls made on the date!!</Typography>
                  </Stack>
                }

              </Box >
            </Card >
          </Grid >


          {/* <Grid item xs={12} md={6} lg={10}>
            <AppNewsUpdate />
          </Grid>



          <Grid item xs={12} md={6} lg={10}>
            <AppTasks />
          </Grid> */}
        </Grid >
      </Container >
    </Page >
  );
}

