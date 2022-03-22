import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Stack, TextField, Button, Grid, Card, CardHeader, Link } from '@mui/material';

import { Icon } from '@iconify/react';

import axios from 'axios';
import DatePicker from '@mui/lab/MobileDatePicker';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { format } from 'date-fns';
// components
import Page from '../components/Page';

let teamList;
let services;
let teamColTemp;
let servCols;
let gOnline;
let gCash;
let myCols;
export default function WorkToday() {
    // const [selectedService, setSelectedService] = useState("");
    const [onlineAmnt, setOnlineAmnt] = useState(0);
    const [cashAmnt, setCashAmnt] = useState(0);
    // const [services, setServices] = useState([]);
    const [cookies, setCookies] = useCookies();
    const [myTotCol, setMyTotCol] = useState(0);
    const data = useSelector((state) => state.profileReducer);
    const [inputDate, setInputDate] = useState(new Date());
    const id = useSelector((state) => state.profileReducer.id);
    const [teamColList, setTeamColList] = useState([]);

    const [myColList, setMyColList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // console.log("id is", id)
        axios.get("/users/getServices", { params: { 'number': localStorage.getItem('number') } })
            .then((res) => {
                services = res.data.services;
                console.log("datetike:", res.data);
            })
        axios.get('/users/getMembers', { params: { id: data.id } })
            .then((res) => {
                teamList = res.data;
                console.log('member dat:', teamList);

                axios
                    .post('/users/workDoneToday/', { id: id, date: inputDate })
                    .then((res) => {
                        if (!Object.keys(cookies).length) {
                            navigate('/sessionExpired');
                        } else {
                            const sTime = new Date().getTime();
                            console.log('col data:', res.data);
                            gCash = 0;
                            gOnline = 0;
                            const colTemp = res.data;
                            const myColTemp = colTemp.filter((item) => item.assign_to === data.id);
                            console.log('myColTemp:', myColTemp);
                            if (myColTemp.length) {
                                let tot = 0;
                                myCols = [];
                                services.forEach((j) => {
                                    const myServCol = myColTemp.filter((item1) => item1.serv_id === j.serv_id);
                                    console.log('myServCol:', myServCol);
                                    if (myServCol.length) {
                                        const online = myServCol.reduce((total, cur) => {
                                            if (cur.mode === 'O')
                                                return total + cur.amnt;
                                            return total;

                                        }, 0);
                                        const cash = myServCol.reduce((total, cur) => {
                                            if (cur.mode === 'C')
                                                return total + cur.amnt;
                                            return total;

                                        }, 0);
                                        tot += online + cash;
                                        gOnline += online;
                                        gCash += cash;

                                        myCols.push({ 'serv_id': j.serv_id, 'serv_name': j.serv_name, 'visits': myServCol.length, 'online': online, 'cash': cash });
                                    }

                                })
                                console.log('myCols:', myCols);
                                setMyColList(myCols);
                                setMyTotCol(tot);

                            }

                            teamColTemp = [];
                            let teamTotal = 0;
                            teamList.forEach((i) => {
                                const memberCol = colTemp.filter((item) => item.assign_to === i.memberId);
                                console.log(memberCol);

                                if (memberCol.length) {
                                    let tot = 0;
                                    servCols = [];
                                    services.forEach((j) => {
                                        const memberServCol = memberCol.filter((item1) => item1.serv_id === j.serv_id);
                                        console.log('memberServCol:', memberServCol);
                                        if (memberServCol.length) {
                                            const online = memberServCol.reduce((total, cur) => {
                                                if (cur.mode === 'O')
                                                    return total + cur.amnt;
                                                return total;

                                            }, 0);
                                            const cash = memberServCol.reduce((total, cur) => {
                                                if (cur.mode === 'C')
                                                    return total + cur.amnt;
                                                return total;

                                            }, 0);
                                            tot += online + cash;
                                            gOnline += online;
                                            gCash += cash;

                                            servCols.push({ 'serv_id': j.serv_id, 'serv_name': j.serv_name, 'visits': memberServCol.length, 'online': online, 'cash': cash });
                                        }
                                    })
                                    teamTotal += tot;
                                    teamColTemp.push({ 'memberId': i.memberId, 'name': i.name, 'memberTotal': tot, 'servCols': servCols, flag: false });


                                    console.log('servCols:', servCols);
                                    // teamColTemp.push(memberCol);
                                }

                            })
                            setTeamColList(teamColTemp);
                            console.log('gCash', gCash);
                            setCashAmnt(gCash);
                            setOnlineAmnt(gOnline);

                            const eTime = new Date().getTime();
                            console.log('time:', eTime - sTime);
                            // setCustList(res.data);
                        }
                    })
                    .catch((err) => {
                        console.log('err', err);
                    });
            });
    }, [id, inputDate]);





    return (
        <Page title="Work Done Today">
            <Box maxWidth="xl" sx={{ width: "100%" }}>
                <Stack sx={{ pb: 1 }} direction="row" justifyContent="space-between">
                {/* <Grid sx={{ mb: 1 }} alignItems="center" container  spacing={1}>

                    <Grid item xs={2}> */}
                        <Button onClick={(event) => {
                            let temp = new Date(inputDate);
                            temp = new Date(temp.setMonth(temp.getMonth() - 1));
                            setMyColList([]);
                            setMyTotCol(0);
                            setInputDate(temp);
                        }
                        }>

                            <Icon height={26} width={26} icon="gg:chevron-double-left-r" /></Button>
                    {/* </Grid>
                    <Grid item xs={2}> */}
                        <Button onClick={(event) => {
                            setMyColList([]);
                            setMyTotCol(0);
                            setInputDate(new Date(inputDate.getTime() - 1000 * 60 * 60 * 24))
                        }}><Icon height={28} width={28} icon="ant-design:left-circle-outlined" /></Button>
                    {/* </Grid>
                    <Grid item xs={4}> */}
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={inputDate}
                                onChange={(newValue) => {
                                    setMyColList([]);
                                    setMyTotCol(0);
                                    setInputDate(newValue);
                                }}
                                
                                renderInput={(params) =>
                                    
                                    <TextField
                                        {...params}
                                        InputProps={{ style: { fontWeight: 'bold' } }}
                                        size="small"
                                        sx={{ width: '100%' }}
                                        fullWidth
                                    />
                                   

                                }
                                inputFormat="dd MMM, yyyy"
                            />
                        </LocalizationProvider>
                       

                    {/* </Grid>
                    <Grid item xs={2}> */}
                        <Button onClick={(event) => {
                            setMyColList([]);
                            setMyTotCol(0);
                            setInputDate(new Date(inputDate.getTime() + 1000 * 60 * 60 * 24))
                        }}><Icon height={28} width={28} icon="ant-design:right-circle-outlined" /></Button>
                    {/* </Grid>
                    <Grid item xs={2}> */}
                        <Button onClick={(event) => {
                            let temp = new Date(inputDate);
                            temp = new Date(temp.setMonth(temp.getMonth() + 1));
                            setMyColList([]);
                            setMyTotCol(0);
                            setInputDate(temp);
                        }
                        }>
                            <Icon height={26} width={26} icon="gg:chevron-double-right-r" /></Button>
                    {/* </Grid>
                </Grid> */}

                </Stack>
                <Stack sx={{ bgcolor: '#004F98', p: 1, borderRadius: 1 }} direction="row" justifyContent="space-between">
                    <Stack>
                        <Typography variant="subtitle" color="#fff">Cash: &#8377;{cashAmnt}</Typography>
                        <Typography variant="subtitle" color="#fff">Online: &#8377;{onlineAmnt}</Typography>
                    </Stack>
                    <Typography variant="h4" color="#fff">Total: &#8377;{cashAmnt + onlineAmnt}</Typography>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={10}>
                        <Card sx={{ my: 1, borderRadius:1 }}>
                            <CardHeader sx={{ mb: 2, py: 1, bgcolor: '#C0C0C0', }} titleTypographyProps={{ color: '#004F98' }} title="My Collection" 
                            action={
                                <Button disabled>
                                <Typography variant="h6" sx={{color:'#004F98'}}>&#8377;{myTotCol}</Typography>
                                </Button>
                            }/>

                            <Box sx={{ mx: 2, mb: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                                {myColList.length > 0 ? (
                                    myColList.map((item) => (
                                        <Stack key={item.serv_id} justifyContent='center'>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="subtitle2">Service: </Typography>
                                                <Typography variant="h6">{item.serv_name}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="subtitle2">Visits:</Typography>
                                                <Typography variant="h6">{item.visits}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="subtitle2">Collection:</Typography>

                                                <Typography variant="h6">Online- &#8377;{item.online}, Cash- &#8377;{item.cash}</Typography>
                                            </Stack>
                                            <hr />
                                        </Stack>
                                    ))
                                ) : (
                                    <Stack
                                        alignItems="center"
                                        sx={{ xs: 2, lg: 5, maxHeight: 300, overflow: 'auto' }}
                                    >
                                        <Typography variant="subtitle1">No Collections for the date!!</Typography>
                                    </Stack>
                                )}

                            </Box>
                            {
                                teamColList.map((item) => (
                                    <Box key={item.memberId}>

                                        <Link style={{ textDecoration: 'none' }} onClick={(event) => {
                                            if (item.flag) {
                                                let newArr = [...teamColList];
                                                newArr = newArr.map((i) =>
                                                    i.memberId === item.memberId ? { ...i, flag: false } : i
                                                )
                                                setTeamColList(newArr);
                                            }
                                            else {
                                                let newArr = [...teamColList];
                                                newArr = newArr.map((i) =>
                                                    i.memberId === item.memberId ? { ...i, flag: true } : i
                                                )
                                                setTeamColList(newArr);
                                            }
                                            console.log(item.flag)
                                        }}>
                                            <CardHeader sx={{ mb: 1, py: 1, bgcolor: '#C0C0C0' }} titleTypographyProps={{ color: '#004F98' }} title={`${item.name} (Rs.${item.memberTotal})`} 
                                            action={
                                                // <Button disabled>
                                                // <Typography variant="h6" sx={{color:'#004F98'}}>&#8377;{item.memberTotal}</Typography>
                                                // </Button>
                                                item.flag ?
                                                <Button>
                                                  <Icon height={24} width={24} icon="akar-icons:minus" />
                                                </Button>
                                                :
                                                <Button>
                                                  <Icon height={24} width={24} icon="ant-design:right-outlined" />
                                                </Button>
                                            }/>
                                        </Link>
                                        {item.flag ?
                                            <Box sx={{ mx: 2, overflow: 'auto', maxHeight: 250 }} dir="ltr">
                                                {
                                                    item.servCols.map((item) => (
                                                        <Stack key={item.serv_id} justifyContent='center'>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="subtitle2">Service: </Typography>
                                                                <Typography variant="h6">{item.serv_name}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="subtitle2">Visits:</Typography>
                                                                <Typography variant="h6">{item.visits}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between">
                                                                <Typography variant="subtitle2">Collection:</Typography>

                                                                <Typography variant="h6">Online- &#8377;{item.online}, Cash- &#8377;{item.cash}</Typography>
                                                            </Stack>
                                                            <hr />
                                                        </Stack>

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
                    </Grid>
                </Grid>
            </Box>
        </Page>
    );
}
