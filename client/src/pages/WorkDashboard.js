// material
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  Button,
  CardHeader,
  Link,
  TextField
} from '@mui/material';
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
let teamList;
let teamWorkTemp;
let teamHistTemp;
export default function DashboardApp() {
  const navigate = useNavigate();

  const [cookies, setCookies] = useCookies();
  const data = useSelector((state) => state.profileReducer);
  const [myWorkList, setMyWorkList] = useState([]);
  const [myHistList, setMyHistList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [teamWorks, setTeamWorks] = useState([]);
  const [teamHists, setTeamHists] = useState([]);
  const [inputDate, setInputDate] = useState(new Date());
  const [totWorkCount, setTotWorkCount] = useState(0);
  const [totHistCount, setTotHistCount] = useState(0);
  const [cFlag, setCFlag] = useState(false);
  const [workFlag, setWorkFlag] = useState(false);
  const [histFlag, setHistFlag] = useState(false);
  // const value = new Date();
  useEffect(() => {
    if (!Object.keys(cookies).length) {
      navigate('/sessionExpired');
    } else {
      // console.log('ud', date);
      axios.get('/users/getMembers', { params: { id: data.id } })
        .then((res) => {
          teamList = res.data;
          axios.post('/users/getTodaysWork', { id: data.id, date: inputDate }).then((res) => {
            console.log('res.data', res.data);

            const temp = res.data.map((item) => {
              const tempItem = item;

              // const date = new Date(item.callDate);
              // let hours = date.getHours();
              // let minutes = date.getMinutes();
              // const ampm = hours >= 12 ? 'PM' : 'AM';
              // hours %= 12;
              // hours = hours || 12;
              // minutes = minutes < 10 ? `0${minutes}` : minutes;
              // const strTime = `${hours}:${minutes} ${ampm}`;

              tempItem.callTime = convertTime(item.callDate);
              tempItem.compTime = convertTime(item.compDate);
              return tempItem;
            })

            console.log('updated res.data', temp);

            const workTemp = temp.filter((item) => item.status === 'O' && (new Date(item.callDate)).toDateString() === (new Date(inputDate)).toDateString());
            const histTemp = temp.filter((item) => item.status === 'C' && (new Date(item.compDate)).toDateString() === (new Date(inputDate)).toDateString());

            setTotWorkCount(workTemp.length);
            setTotHistCount(histTemp.length);
            console.log('team list:', teamList);
            const myWorkTemp = workTemp.filter((item) => item.user_id === data.id);

            const myHistTemp = histTemp.filter((item) => item.user_id === data.id);
            teamWorkTemp = [];
            teamHistTemp = [];
            teamList.forEach((i) => {
              const memberWork = workTemp.filter((item) => item.user_id === i.memberId);
              const memberHist = histTemp.filter((item) => item.user_id === i.memberId);
              if (memberWork.length)
                teamWorkTemp.push({ "id": i.memberId, "name": i.name, "custs": memberWork, flag: false });

              if (memberHist.length)
                teamHistTemp.push({ "id": i.memberId, "name": i.name, "custs": memberHist, flag: false });
            }
            );
            console.log(teamHistTemp);
            setTeamWorks(teamWorkTemp);
            setTeamHists(teamHistTemp);
            setMyWorkList(myWorkTemp);
            setMyHistList(myHistTemp);
          });
        });
      axios.post('/users/getCallbacks', { spId: data.id }).then((res) => {
        console.log('callbacks', res.data);
        let callbacks = res.data;
        callbacks = callbacks.map((item) => {
          let dt = new Date(item.callDate).toDateString();
          dt = dt.slice(4);
          item.callDate = `${dt} ${convertTime(item.callDate)}`;
          return item;
        })
        setComplaints(callbacks);
      })
        .catch((err) => {
          console.log('err', err);
        })
    }
  }, [data.id, inputDate]);

  const convertTime = (dt) => {
    const date = new Date(dt);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
  }

  const addCalls = () => {
    // console.log("click")
    navigate('/dashboard/newcalls');
  };
  const onPhoneClick = (event, id) => {
    navigate(`/dashboard/work/${id}`);
  };
  const onPhoneClick2 = (event, id) => {
    navigate(`/dashboard/workHistory/${id}`);
  };
  const editCalls = (event, id) => {
    navigate(`/dashboard/editCalls/${id}`);
  };
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Work Dashboard</Typography>
            <Stack alignItems="flex-end">
              <Button variant="contained" onClick={addCalls}>
                <Typography variant="h6">+Add calls</Typography>
              </Button>
            </Stack>
          </Stack>
        </Box>
        {/* <Stack sx={{ pb: 1 }} direction="row" alignItems="center"> */}
        <Grid container>
          <Grid item xs={2} md={2} lg={2}>
          <Button onClick={(event) => {
            let temp = new Date(inputDate);
            temp = new Date(temp.setMonth(temp.getMonth() - 1));
            setInputDate(temp);
          }
          }><Icon height={26} width={26} icon="gg:chevron-double-left-r" /></Button>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
          <Button onClick={(event) => setInputDate(new Date(inputDate.getTime() - 1000 * 60 * 60 * 24))}><Icon height={28} width={28} icon="ant-design:left-circle-outlined" /></Button>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker

              value={inputDate}
              onChange={(newValue) => {
                console.log('date:', format(new Date(newValue), 'dd MMM yyyy HH:mm'));
                setInputDate(newValue);
              }}
              renderInput={(params) => {
                console.log(params);
                return (
                  <TextField
                    {...params}
                    InputProps={{ style: { fontWeight: 'bold', fontSize:14 } }}
                    size="small"
                    sx={{ width: '100%' }}
                    fullWidth

                  />
                );
              }}
              inputFormat="dd MMM, yyyy"
            // onMonthChange={console.log('sc')}
            />
          </LocalizationProvider>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
          <Button onClick={(event) => setInputDate(new Date(inputDate.getTime() + 1000 * 60 * 60 * 24))}><Icon height={28} width={28} icon="ant-design:right-circle-outlined" /></Button>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
          <Button onClick={(event) => {
            let temp = new Date(inputDate);
            temp = new Date(temp.setMonth(temp.getMonth() + 1));
            setInputDate(temp);
          }
          }><Icon height={26} width={26} icon="gg:chevron-double-right-r" /></Button>
          </Grid>
          </Grid>
        {/* </Stack> */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={10}>

            <Card sx={{ my: 1, borderRadius: 1 }}>
              <CardHeader sx={{ py: 1, bgcolor: '#004F98', }} titleTypographyProps={{ color: '#fff' }} title={`Planned Calls (${totWorkCount})`} />

              <Box sx={{  overflow: 'auto', maxHeight: 250 }} dir="ltr">
                <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                  if (workFlag)
                    setWorkFlag(false);
                  else
                    setWorkFlag(true);
                }}>
                  <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#C0C0C0', }} titleTypographyProps={{ color: '#004F98' }} title={`My Calls (${myWorkList.length})`} action={
                        workFlag ?
                          <Button>
                            <Icon height={24} width={24} icon="akar-icons:minus" />
                          </Button>
                          :
                          <Button>
                            <Icon height={24} width={24} icon="ant-design:right-outlined" />
                          </Button>

                      }/>
                </Link>
                {
                  workFlag &&
                (myWorkList.length > 0 ? (
                  myWorkList.map((item) => (
                    <Box key={item.work_id} sx={{ mx: 2 }}>
                      <Grid sx={{ mb: 1 }} container spacing={2}>

                        <Grid item xs={7}>
                          <Link
                            component="button"
                            variant="body2"
                            onClick={(event) => onPhoneClick(event, item.work_id)}
                          >
                            <Typography variant="subtitle2">{item.name}</Typography>

                          </Link>
                          <Typography variant="subtitle2">Service: {item.serv_name}</Typography>
                          <Typography variant="subtitle2">Time of visit: {item.callTime}</Typography>
                        </Grid>
                        <Grid item container xs={5}>
                          <Grid item xs={4}>
                            <Link href={`tel:${item.cust_phone}`}>
                              <Icon icon="ph:phone-call-light" width={22} height={22} />
                            </Link>
                          </Grid>
                          <Grid item xs={4}>
                            <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}>
                              <Icon icon="logos:whatsapp" width={22} height={22} />
                            </Link>
                          </Grid>
                          {data.user_type === 'O' ? (
                            <Grid item xs={4}>
                              <Link
                                component="button"
                                variant="body2"
                                onClick={(event) => editCalls(event, item.work_id)}
                              >
                                <Icon icon="lucide:pencil" width={20} height={20} />
                              </Link>
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Stack
                    alignItems="center"
                    sx={{ xs: 2, lg: 5, maxHeight: 300, overflow: 'auto' }}
                  >
                    <Typography variant="subtitle1">No calls planned for the date!!</Typography>
                  </Stack>
                ))}

              </Box>
              {
                teamWorks.map((item) => (
                  <Box key={item.id}>

                    <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                      if (item.flag) {
                        let newArr = [...teamWorks];
                        newArr = newArr.map((i) =>
                          i.id === item.id ? { ...i, flag: false } : i
                        )
                        setTeamWorks(newArr);
                      }
                      else {
                        let newArr = [...teamWorks];
                        newArr = newArr.map((i) =>
                          i.id === item.id ? { ...i, flag: true } : i
                        )
                        setTeamWorks(newArr);
                      }
                      console.log(item.flag)
                    }}>
                      <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#C0C0C0', }} titleTypographyProps={{ color: '#004F98' }} action={
                        item.flag ?
                          <Button>
                            <Icon height={24} width={24} icon="akar-icons:minus" />
                          </Button>
                          :
                          <Button>
                            <Icon height={24} width={24} icon="ant-design:right-outlined" />
                          </Button>

                      } title={`${item.name} (${item.custs.length})`} />
                    </Link>
                    {item.flag ?
                      <Box sx={{ mx: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                        {
                          item.custs.map((item) => (
                            // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                            <Grid key={item.work_id} sx={{ mb: 1 }} container spacing={2}>

                              <Grid item xs={7}>
                                <Link
                                  component="button"
                                  variant="body2"
                                  onClick={(event) => onPhoneClick(event, item.work_id)}
                                >
                                  <Typography variant="subtitle2">{item.name}</Typography>

                                </Link>
                                <Typography variant="subtitle2">Service: {item.serv_name}</Typography>
                                <Typography variant="subtitle2">Time of visit: {item.callTime}</Typography>
                              </Grid>
                              <Grid item container xs={5}>
                                <Grid item xs={4}>
                                  <Link href={`tel:${item.cust_phone}`}>
                                    <Icon icon="ph:phone-call-light" width={22} height={22} />
                                  </Link>
                                </Grid>
                                <Grid item xs={4}>
                                  <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}>
                                    <Icon icon="logos:whatsapp" width={22} height={22} />
                                  </Link>

                                </Grid>
                                {data.user_type === 'O' ? (
                                  <Grid item xs={4}>
                                    <Link
                                      component="button"
                                      variant="body2"
                                      onClick={(event) => editCalls(event, item.work_id)}
                                    >
                                      <Icon icon="lucide:pencil" width={20} height={20} />
                                    </Link>
                                  </Grid>
                                ) : (
                                  <></>
                                )}
                              </Grid>

                            </Grid>

                          ))
                        }

                      </Box>
                      :
                      <></>
                    }
                  </Box>
                ))
              }

            </Card>

            <Card sx={{ mt: 3, borderRadius: 1 }}>

              <CardHeader sx={{ py: 1, bgcolor: '#02590f', }} titleTypographyProps={{ color: '#fff' }} title={`Completed Calls (${totHistCount})`} />
              <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                  if (histFlag)
                    setHistFlag(false);
                  else
                    setHistFlag(true);
                }}>
              <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#C0C0C0', }} titleTypographyProps={{ color: '#004F98' }} title={`My Calls (${myHistList.length})`} action={
                        histFlag ?
                          <Button>
                            <Icon height={24} width={24} icon="akar-icons:minus" />
                          </Button>
                          :
                          <Button>
                            <Icon height={24} width={24} icon="ant-design:right-outlined" />
                          </Button>

                      }/>
              </Link>
              <Box sx={{ mx: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                {
                  histFlag &&
                (myHistList.length > 0 ? (
                  myHistList.map((item) => (
                    // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                    <Grid key={item.work_id} sx={{ mb: 1 }} container spacing={2}>
                      <Grid item xs={7}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(event) => onPhoneClick2(event, item.work_id)}
                        >
                          <Typography variant="subtitle2">{item.name}</Typography>
                        </Link>
                        <Typography variant="subtitle2">Service: {item.serv_name}</Typography>
                        <Typography variant="subtitle2">Time of visit: {item.compTime}</Typography>
                      </Grid>
                      <Grid item container xs={5}>
                        <Grid item xs={4}>
                          <Link href={`tel:${item.cust_phone}`}>
                            <Icon icon="ph:phone-call-light" width={24} height={24} />
                          </Link>
                        </Grid>
                        <Grid item xs={4}>
                          <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}>
                            <Icon icon="logos:whatsapp" width={22} height={22} />
                          </Link>
                        </Grid>
                        <Grid item xs={4}>
                          <></>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <Stack alignItems="center" sx={{ xs: 2, lg: 5 }}>
                    <Typography variant="subtitle1">No calls made on the date!!</Typography>
                  </Stack>
                ))}
              </Box>

              {
                teamHists.map((item) => (
                  <Box key={item.id}>
                    <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                      if (item.flag) {
                        let newArr = [...teamHists];
                        newArr = newArr.map((i) =>
                          i.id === item.id ? { ...i, flag: false } : i
                        )
                        setTeamHists(newArr);
                      }
                      else {
                        let newArr = [...teamHists];
                        newArr = newArr.map((i) =>
                          i.id === item.id ? { ...i, flag: true } : i
                        )
                        setTeamHists(newArr);
                      }
                      console.log(item.flag)
                    }}>
                      <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#C0C0C0', }} titleTypographyProps={{ color: '#004F98' }} title={`${item.name} (${item.custs.length})`} action={
                        item.flag ?
                          <Button>
                            <Icon height={24} width={24} icon="akar-icons:minus" />
                          </Button>
                          :
                          <Button>
                            <Icon height={24} width={24} icon="ant-design:right-outlined" />
                          </Button>

                      } />
                      {/* <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#90EE90', borderRadius: 1 }} title={`${item.name}(${item.custs.length})`} /> */}
                    </Link>

                    {item.flag ?
                      <Box sx={{ mx: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                        {
                          item.custs.map((item) => (
                            // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                            <Grid key={item.work_id} sx={{ mb: 1 }} container spacing={2}>
                              <Grid item xs={7}>
                                <Link
                                  component="button"
                                  variant="body2"
                                  onClick={(event) => onPhoneClick2(event, item.work_id)}
                                >
                                  <Typography variant="subtitle2">{item.name}</Typography>

                                </Link>
                                <Typography variant="subtitle2">Service: {item.serv_name}</Typography>
                                <Typography variant="subtitle2">Time of visit: {item.compTime}</Typography>
                              </Grid>
                              <Grid item container xs={5}>
                                <Grid item xs={4}>
                                  <Link href={`tel:${item.cust_phone}`}>
                                    <Icon icon="ph:phone-call-light" width={22} height={22} />
                                  </Link>
                                </Grid>
                                <Grid item xs={4}>
                                  <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}>
                                    <Icon icon="logos:whatsapp" width={22} height={22} />
                                  </Link>
                                </Grid>

                                <Grid item xs={4}>
                                  <></>
                                </Grid>
                              </Grid>

                            </Grid>

                          ))
                        }

                      </Box>
                      :
                      <></>
                    }
                  </Box>
                ))
              }
            </Card>

            <Card sx={{ mt: 3, borderRadius: 1 }}>
              <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                if (cFlag)
                  setCFlag(false);
                else
                  setCFlag(true);
              }}>
                <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#8B0000', borderRadius: 1, }} titleTypographyProps={{ color: '#fff' }} title={`Callback Complaints (${complaints.length})`} action={
                  cFlag ?
                    <Button>
                      <Icon color="#fff" height={24} width={24} icon="akar-icons:minus" />
                    </Button>
                    :
                    <Button>
                      <Icon color="#fff" height={24} width={24} icon="ant-design:right-outlined" />
                    </Button>

                } />
              </Link>
              {
                cFlag &&
                <Box sx={{ mx: 2, mb: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                  {complaints.length > 0 ? (
                    complaints.map((item) => (
                      // <Stack key={item.work_id} justifyContent='space-between' direction='row' spacing={{ xs: 2, lg: 5 }}>
                      <Grid key={item.work_id} sx={{ mb: 1 }} container spacing={2}>
                        <Grid item xs={7}>
                          <Link
                            component="button"
                            variant="body2"
                            onClick={(event) => onPhoneClick2(event, item.work_id)}
                          >
                            <Typography variant="subtitle2">{item.name}</Typography>
                          </Link>
                          <Typography variant="subtitle2">Service: {item.serv_name}</Typography>
                          <Typography variant="subtitle2">Time of visit: {item.callDate}</Typography>
                        </Grid>
                        <Grid item container xs={5}>
                          <Grid item xs={4}>
                            <Link href={`tel:${item.cust_phone}`}>
                              <Icon icon="ph:phone-call-light" width={24} height={24} />
                            </Link>
                          </Grid>
                          <Grid item xs={4}>
                            <Link href={`whatsapp://send?phone=+91${item.cust_phone}`}>
                              <Icon icon="logos:whatsapp" width={22} height={22} />
                            </Link>
                          </Grid>
                          <Grid item xs={12}>
                          {data.user_type === 'O' ?
                            <Button variant="contained" onClick={(event) => editCalls(event, item.work_id)}>Reassign</Button>
                            :
                            <></>
                          }
                          </Grid>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <Stack alignItems="center" sx={{ xs: 2, lg: 5 }}>
                      <Typography variant="subtitle1">No Complaints!!</Typography>
                    </Stack>
                  )}
                </Box>
              }
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
