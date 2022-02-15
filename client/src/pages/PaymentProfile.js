import React, { useState, useEffect } from 'react';
import upiqr from 'upiqr';
// import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { Icon } from '@iconify/react';
import {
    Grid,
    Container,
    Typography,
    Avatar,
    Stack,
    Button,
    Alert,
    TextField
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { addVPA } from '../actions/index';
import Page from '../components/Page';

const axios = require('axios');

export default function PaymentProfile() {
    const data = useSelector((state) => state.profileReducer);
    // const [servData, setServData] = useState('');
    const [QR, setQR] = useState('');
    const [upi, setUPI] = useState('');
    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // const [image, setImage] = useState('');
    const [vpa, setVPA] = useState('');
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // const fileToDataUri = (file) => new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         resolve(event.target.result)
    //     };
    //     reader.readAsDataURL(file);
    // })
    // const fileChangeHandler = (file) => {
    //     if (!file) {
    //         setImage('');
    //         return;
    //     }

    //     fileToDataUri(file)
    //         .then(dataUri => {
    //             setImage(dataUri)
    //         })

    //     console.log('image:', image);
    // }

    const onSave = () => {
        if (vpa) {
            setError(false);

            axios
                .post('/users/uploadQR', { id: data.id, vpa: vpa })
                .then((res) => {
                    setQR('');
                    setRefresh(true);
                    setRefresh(false);
                    setVPA('');
                    dispatch(addVPA(vpa));
                })
                .catch((err) => {
                    console.log('Error: ', err);
                });
        } else {
            setError(true);
        }
    };

    const onCancel = () => {
        navigate('/dashboard/profile');
        console.log('cancel');
    };
    const handleVPA = (event) => {
        setVPA(event.target.value);
    };

    useEffect(() => {
        axios
            .post('/users/getPaymentDetails', { id: data.id })
            .then((res) => {
                // let bufferOriginal = null;
                console.log('Error', res.data);
                if (res.data[0]) {
                    // bufferOriginal = Buffer.from(res.data[0]);
                    setUPI(res.data[0]);
                    upiqr({
                        payeeVPA: res.data[0],
                        payeeName: `${data.fname} ${data.lname}`
                    })
                        .then((upi) => {
                            console.log('upi qr', upi.qr);
                            setQR(upi.qr);
                            console.log('upi intent', upi.intent);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    // setQR(bufferOriginal.toString('utf8'));
                }

                // setServData(res.data[1]);
            })
            .catch((err) => {
                console.log('Error', err);
            });
    }, [data.id, QR, refresh]);
    return (
        <Page title="Payment Profile">
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12} align="center">
                        <Stack spacing={2}>
                            <Typography variant="h4">Bharat QR - GPay, PhonePe, Paytm, UPI</Typography>
                            {/* <Avatar sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" /> */}

                            {QR ? (
                                <Avatar
                                    src={QR}
                                    sx={{ width: 250, height: 250, alignSelf: 'center' }}
                                    alt="photoURL"
                                    variant="square"
                                />
                            ) : (
                                <Avatar
                                    sx={{ width: 200, height: 200, alignSelf: 'center' }}
                                    alt="photoURL"
                                    variant="square"
                                />
                            )}
                            {/* <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="h6">Mobile Number: </Typography>
                                <Typography variant="h6">{servData}</Typography>
                            </Stack> */}
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="h6">UPI ID:</Typography>
                                <Typography variant="h6">{upi}</Typography>
                            </Stack>
                            {data.user_type === 'O' && (
                                <Stack spacing={3}>
                                    <TextField
                                        size="small"
                                        label="Enter your VPA"
                                        value={vpa}
                                        onChange={handleVPA}

                                    // error={Boolean(touched.phone && errors.phone)}
                                    />
                                    <Button
                                        sx={{ width: '50%', alignSelf: 'center' }}
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        onClick={onSave}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        color="error"
                                        sx={{ border: 1.5, width: '50%', alignSelf: 'center' }}
                                        onClick={onCancel}
                                    >
                                        Back
                                    </Button>
                                </Stack>
                            )}

                            {error && <Alert severity="error">Please enter a VPA first!</Alert>}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
