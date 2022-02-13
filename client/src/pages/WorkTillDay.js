import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Box, Container, Typography, Stack } from '@mui/material';

import axios from 'axios';
// components
import Page from '../components/Page';




export default function WorkToday() {
    // const [selectedService, setSelectedService] = useState("");
    const [onlineAmnt, setOnlineAmnt] = useState(0);
    const [cashAmnt, setCashAmnt] = useState(0);
    const [cookies] = useCookies();
    const id = useSelector((state) => state.profileReducer.id);
    const navigate = useNavigate();
    useEffect(() => {
        // console.log("id is", id)
        axios.post('http://localhost:5000/users/workTillToday/', { 'id': id })
            .then((res) => {
                if (!Object.keys(cookies).length) {
                    navigate('/sessionExpired')
                }
                else {
                    console.log('res data:', res.data);
                    res.data.map((item)=>{
                        if(item.mode==='O')
                        {
                            setOnlineAmnt(item.amnt);
                        }
                        else
                        {
                            setCashAmnt(item.amnt);
                        }
                        return item;
                    })
                    // setCustList(res.data);

                }
            })
            .catch((err) => {
                console.log('err', err);
            })

       
    }, [id])

    

    
    return (
        <Page title="Work Done Today">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Work done till day</Typography>
                </Box>
                <Stack spacing={2}>
                <Typography alignSelf="center" variant="h6">Payment Collection</Typography>
                    <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Online</Typography>
                    <Typography variant="h6">&#8377;{onlineAmnt}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Cash</Typography>
                    <Typography variant="h6">&#8377;{cashAmnt}</Typography>
                    </Stack>
                   <hr/>
                   <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">&#8377;{onlineAmnt+cashAmnt}</Typography>
                    </Stack>
                </Stack>

            </Container>
        </Page>

    );
}