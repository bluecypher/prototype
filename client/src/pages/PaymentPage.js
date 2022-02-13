import React, { useState, useEffect } from 'react';
import upiqr from 'upiqr';
// import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
// import { Icon } from '@iconify/react';
import { Grid, Container, Typography, Avatar, Stack, Button, Alert, Box } from '@mui/material';
import { useSelector } from "react-redux";
import { Icon } from '@iconify/react';



import Page from '../components/Page';



const axios = require('axios');


export default function PaymentPage() {
    const data = useSelector((state) => state.profileReducer);
    // const [servData, setServData] = useState('');
    const [QR, setQR] = useState('');
    const [error, setError] = useState(false);
    const [image, setImage] = useState('');
    const navigate = useNavigate();
    const { workId } = useParams();

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {

            resolve(event.target.result)
        };
        
        reader.readAsDataURL(file);
        
    })
    const fileChangeHandler = (file) => {
        if (!file) {
            setImage('');
            return;
        }
        console.log('def',file);
        fileToDataUri(file)
            .then(dataUri => {
                setImage(dataUri)
            })

        console.log('image:', image);
    }

    const onSave = () => {
        if(image)
        {
            navigate('/dashboard/work');
            
        }
        else{
            setError(true);
        }
    }

    useEffect(() => {
        console.log(data.vpa)
        
        axios.post('http://localhost:5000/users/getAmount', { 'id': workId })
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    upiqr({
                        payeeVPA: data.vpa,
                        payeeName: `${data.fname} ${data.lname}`,
                        amount: res.data[0].amount
                    })
                    .then((upi) => {
                            console.log('upi qr', upi.qr);
                            setQR(upi.qr);
                            console.log('upi intent', upi.intent);
                        })
                    .catch(err => {
                            console.log(err);
                        });
                }
       
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }, [ QR, workId])
    return (
        <Page title="Payment Page">
            <Container maxWidth="xl">

                <Grid container spacing={3} >
                    <Grid item xs={12} sm={12} md={12} align='center'>
                        <Stack spacing={2}>
                            <Typography variant="h4">Bharat QR - GPay, PhonePe, Paytm, UPI</Typography>
                            {/* <Avatar sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" /> */}

                            {
                                QR ?
                                    <Avatar src={QR} sx={{ width: 250, height: 250, alignSelf: 'center' }} alt="photoURL" variant="square" />
                                    :
                                    <Avatar sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" />
                            }
                            {/* <Typography variant="h6">Mobile number: {servData}</Typography> */}

                            <Stack sx={{ pt: 3 }} direction="row" alignItems='center' justifyContent="space-evenly">
                                <Typography variant="h6">Take picture of the receipt</Typography>
                                <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */}</>
                                <label htmlFor="icon-button-file"><Icon icon="ion:camera" width={32} height={32} /></label>

                                <input style={{ display: 'none' }} accept='image/*' id='icon-button-file' type='file' capture='environment' onChange={(event) => { fileChangeHandler(event.target.files[0] || null) }}/>
                                {
                                    image &&
                                    <Avatar src={image} sx={{ width: 20, height: 20, alignSelf: 'center' }} alt="photoURL" variant="square" />
                                }
                            </Stack>
                            {
                                error && 
                                <Alert severity="warning">Please select an image first!</Alert>
                            }

                            <Box sx={{ pt: 5 }} justifyContent="flex-end">
                                <Button
                                    sx={{ width: "50%", alignSelf: "center" }}

                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={onSave}>
                                    Upload Receipt
                                </Button>
                            </Box>
                            <Button
                                    sx={{ width: "50%", alignSelf: "center" }}

                                    size="large"
                                    
                                    onClick={()=>navigate('dashboard/work')}>
                                    Back To Dashboard
                                </Button>


                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}