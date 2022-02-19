
import { useState, useEffect } from 'react';

// import { useCookies } from 'react-cookie';

// import { useSelector } from "react-redux";

import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// material
// import { styled } from '@mui/material/styles';
import {
    Box,
    Button,
    Typography,
    Container,
    Stack,
    TextField,
    
} from '@mui/material';

import Page from '../components/Page';

export default function WorkHistory() {
    const { workId } = useParams();
    const [name, setName] = useState('');
    const [serv, setServ] = useState('');
    const [grnt, setGrnt] = useState(0);
    const [mop, setMop] = useState('');
    const [wDetails, setWDetails] = useState('');
    const [amnt, setAmnt] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        console.log(workId);
        axios
            .post('/users/getWorkDetails', { workId: workId })
            .then((res) => {
                console.log('result', res);
                setName(res.data[0].cust_name);
                setServ(res.data[0].serv_name);
                setWDetails(res.data[0].work_desc);
                setGrnt(res.data[0].gaurantee);
                setAmnt(res.data[0].amount);
                setMop(res.data[0].payment_mode);
            })
            .catch((err) => {
                console.log('error', err);
            });
    }, [workId]);

  

    // const formik = useFormik({
    //     enableReinitialize: true,
    //     initialValues: {
    //         amnt: '',
    //         wd: wDetails,
    //         nxtWork: ''
    //     },
    //     validationSchema: RegisterSchema,
    //     onSubmit: () => {
    //         console.log('imag', wDetails);
    //         if (mop) {
    //             axios
    //                 .post('/users/updateWork', {
    //                     workId: workId,

    //                     name: name,
    //                     serv: serv,
    //                     amnt: formik.values.amnt,
    //                     wDetails: formik.values.wd,
    //                     wrnt: grnt,
    //                     pmtMethod: mop,
    //                     nxtDate: date,
    //                     nxtWork: formik.values.nxtWork
    //                 })
    //                 .then((response) => {
    //                     console.log('response:', response);
    //                     if (response.data === 'Success') {
    //                         if (mop === 'Online') {
    //                             navigate(`/dashboard/payment/${workId}`, { replace: true });
    //                         } else {
    //                             navigate('/dashboard/work', { replace: true });
    //                         }
    //                     }
    //                 })
    //                 .catch((e) => {
    //                     console.log('Error', e);
    //                 });
    //         } else {
    //             setError(true);
    //         }
    //     }
    // });

    const onCancel = () => {
        navigate('/dashboard/work');
        console.log('cancel');
    };

    // const { touched, errors, handleSubmit, getFieldProps } = formik;

    return (
        <Page title="Work History">
            <Container>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Work Done</Typography>
                </Box>
                {/* <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}> */}
                    <Stack justifyContent="space-between">
                <Stack spacing={3} marginBottom={20}>
                    <TextField
                        fullWidth
                        value={name}
                        inputProps={{
                            readOnly: true,
                            disabled: true
                        }}
                        label="Customer name"
                    />
                    {/* <Typography variant="subtitle">{name}</Typography>
                             <Typography variant="subtitle">{serv}</Typography> */}
                    <TextField
                        fullWidth
                        value={serv}
                        inputProps={{
                            readOnly: true,
                            disabled: true
                        }}
                        label="Service provided"
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows="2"
                        value={wDetails}
                        type="text"
                        label="Work Done"
                        inputProps={{
                            readOnly: true,
                            disabled: true
                        }}

                    />
                   
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Warranty</Typography>
                        {
                            grnt ?
                                <Typography variant="h6">{grnt} Months</Typography>
                                :
                                <Typography variant="h6">No Warranty Provided</Typography>
                        }
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Payment</Typography>
                        {
                            mop === 'N' ?
                                <Typography variant="h6">No Payment</Typography>
                                :
                                (<Stack>
                                    <Typography variant="h6">&#8377;{amnt} collected via</Typography>
                                    {mop === 'C' ?
                                        <Typography variant="h6">Cash Payment</Typography>
                                        :
                                        <Typography variant="h6">Online Payment</Typography>
                                    }
                                </Stack>
                                )
                        }
                    </Stack>
                    
                </Stack>
                
                <Button sx={{border:1.5,}} variant="outlined" size="large" color="error" onClick={onCancel}>
                        Back
                    </Button>
                    </Stack>
                {/* </Form>
                </FormikProvider> */}
            </Container>
        </Page>
    );
}
