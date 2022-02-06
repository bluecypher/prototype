

import React, { useState, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import { Link as RouterLink, useNavigate, useParams, } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Box, Grid, Container, Typography, Avatar, Stack, Button, Link, IconButton } from '@mui/material';
import { useSelector } from "react-redux";

import bxEdit from '@iconify/icons-eva/edit-2-outline';


import Page from '../components/Page';


const axios = require('axios');


export default function CustomerProfile() {
    const { custId } = useParams();
    const data = useSelector((state) => state.profileReducer);
    const [custInfo, setCustInfo] = useState({});
    const [workPlan, setWorkPlan] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);
    const navigate = useNavigate();
    const onEdit = () => {
        console.log('Edit');
    }
    useEffect(() => {

        axios.post('http://localhost:5000/users/getCustomerDetails', { 'custId': custId, 'spId': data.id })
            .then((res) => {
                console.log("result", res);
                setCustInfo(res.data.info[0]);
                setWorkPlan(res.data.work);
                setWorkHistory(res.data.history);
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }, [])
    return (
        <Page title="Customer Profile">
            <Container maxWidth="xl">
                <Stack direction="row" justifyContent="space-between">

                    <Typography variant="h4">Customer Profile</Typography>

                    {/* <IconButton onClick={onEdit} size="large">
                        <Icon icon={bxEdit} />
                    </IconButton> */}
                </Stack>
                <Grid container spacing={3} >


                    <Grid item xs={12} sm={6} md={12} alignItems='center'>
                        <Stack spacing={2}>
                            <hr />
                            <Stack direction="row" justifyContent="space-between" spacing={2}>

                                <Typography variant="h6">Name:    </Typography>
                                <Typography variant="subtitle2">{custInfo.name}  </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="h6">Address:    </Typography>
                                <Typography variant="subtitle2">{custInfo.add1}  </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="h6">Phone number:    </Typography>
                                <Typography variant="subtitle2">{custInfo.number}  </Typography>
                            </Stack>
                            {/* <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="h6">Email:    </Typography>
                                <Typography variant="subtitle2">{data.email}  </Typography>
                            </Stack> */}
                            <hr />
                            <Stack spacing={2}>
                                <Typography variant="h6">Work History</Typography>
                                {
                                    workHistory.length ?
                                        workHistory.map((item) =>
                                            <Stack key={item.work_list_id} spacing={1}>

                                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                                    <Typography variant="body">{item.serv_name}</Typography>
                                                    <Typography variant="subtitle">{item.plan.slice(0, 10)}</Typography>

                                                </Stack>
                                                <Typography variant="body">{item.work_desc}</Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="body">&#8377;{item.amnt} received through</Typography>
                                                    {item.mode === 'C' ?
                                                        <Typography variant="body">cash payment</Typography>
                                                        :
                                                        <Typography variant="body">online payment</Typography>
                                                    }
                                                </Stack>
                                            </Stack>
                                        )
                                        :
                                        <Typography variant="subtitle2">Nothing to show here!!</Typography>


                                }
                            </Stack>
                            <hr />
                            <Stack spacing={2}>
                                <Typography variant="h6">Next Calls</Typography>
                                {
                                    workPlan.length ?
                                        workPlan.map((item) =>
                                            <Stack key={item.work_list_id} spacing={1}>
                                                
                                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                                    <Typography variant="body">{item.serv_name} </Typography>
                                                    <Typography variant="subtitle">{item.plan.slice(0, 10)}</Typography>
                                                    
                                                </Stack>
                                                <Typography variant="body">{item.work_desc}</Typography>
                                            </Stack>
                                        )
                                        :
                                        <Typography variant="subtitle2">Nothing to show here!!</Typography>


                                }
                            </Stack>
                            {/* <Stack direction="row" justifyContent="space-between" spacing={2}>

                                {
                                    servData.map((item) => (
                                        <Stack key={item.serv_id} spacing={1}>
                                            <Typography alignSelf='center' variant="subtitle2">{item.serv_name}</Typography>
                                        </Stack>
                                    ))
                                }
                            </Stack> */}
                            <hr />


                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}
