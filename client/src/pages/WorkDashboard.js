// material
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Box, Grid, Container, Typography, Card, Stack, Button, CardHeader, Link } from '@mui/material';
import axios from 'axios';
// components
import { Icon } from '@iconify/react';
import Page from '../components/Page';

import {
  AppTasks,

  AppNewsUpdate,

  AppConversionRates
} from '../components/_dashboard/app';






export default function DashboardApp() {
  const navigate = useNavigate();
  
  const [cookies, setCookies] = useCookies();
  const data = useSelector((state) => state.profileReducer);
  const [workList, setWorkList] = useState([]);
  useEffect(() => {

    if (!Object.keys(cookies).length) {
      navigate('/sessionExpired')

    }
    else {
      console.log('ud', data.id);
      axios.post('/users/getTodaysWork', { 'id': data.id })
        .then((res) => {
          console.log('res.data', res.data);
          setWorkList(res.data);
        })
    }
  }, [data.id])
  const addCalls = () => {
    // console.log("click")
    navigate("/dashboard/newcalls");
  };
  const onPhoneClick = (event,id) => {

    
    navigate(`/dashboard/work/${id}`);
  }
  const editCalls = (event,id) => {
    navigate(`/dashboard/editCalls/${id}`);
  }
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Work Dashboard</Typography>
        </Box>
        <Grid container spacing={3}>



          <Grid item xs={12} md={6} lg={10}>
            <Card>
              <CardHeader title="Today's Calls"
                action={
                  <Button onClick={addCalls}>+Add calls</Button>
                } />

              <Box sx={{ mx: 2 }} dir="ltr">

                <Stack sx={{ justifyContent: 'space-between', my: 2,}} spacing={2}>
                  {workList.length > 0 ?
                    workList.map((item) => (
                      <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(event)=>onPhoneClick(event,item.work_id)}
                        >
                        <Typography variant="subtitle2">{item.name}</Typography>
                        </Link>
                        <Typography variant="subtitle2">{item.addr}</Typography>
                        {/* <Link
                          component="button"
                          variant="body2"
                          onClick={(event)=>onPhoneClick(event,item.work_id)}
                        >{item.cust_phone}</Link> */}
                        <Link href={`tel:${item.cust_phone}`}><Icon icon="ph:phone-call-light" width={24} height={24}/></Link>
                        
                        {
                          data.user_type==='O'?

                          <Link
                          component="button"
                          variant="body2"
                          onClick={(event)=>editCalls(event,item.work_id)}
                        >
                        <Icon icon="lucide:pencil" width={21} height={21}/>
                        </Link>
                        :
                        <></>
                        }
                      </Stack>
                    ))
                    :
                    <Stack justifyContent='center' direction='row' spacing={{ xs: 2, lg: 5 }}>
                      <Typography variant="subtitle1">No calls for today!!</Typography>
                    </Stack>

                  }
                  {/* <Stack justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography variant="subtitle2">Addresssd s</Typography>
                    <Typography variant="subtitle2">Call Icon</Typography>
                  </Stack>
                  <Stack justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography variant="subtitle2">Address</Typography>
                    <Typography variant="subtitle2">Call Icon</Typography>
                  </Stack> */}

                </Stack>
              </Box>
            </Card>
          </Grid>


          {/* <Grid item xs={12} md={6} lg={10}>
            <AppNewsUpdate />
          </Grid>



          <Grid item xs={12} md={6} lg={10}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
