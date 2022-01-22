import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// import { useCookies } from 'react-cookie';

import { useSelector } from "react-redux";

import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// material
// import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, Stack, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Page from '../components/Page';



export default function WorkUpdate() {

    const { workId } = useParams();
    const [name, setName] = useState('');
    const [serv, setServ] = useState('');
    const [grnt, setGrnt] = useState(0);
    const [amnt, setAmnt] = useState('');
    const [mop, setMop] = useState('');
    const [date, setDate] = useState('');
    const [nxtWork, setNxtWork] = useState('');
    const id = useSelector((state) => state.profileReducer.id);
    const [wDetails, setWDetails] = useState('');
    const numbers = [1, 3, 6, 9, 12];
    const navigate = useNavigate();

    const onSubmit = () =>{
        console.log('imajsdjg',amnt, wDetails);

            axios.post('http://localhost:5000/users/updateWork', {
                'workId': workId,

                'name': name,
                'serv': serv,
                'amnt': amnt,
                'wDetails': wDetails,
                'wrnt' : grnt,
                'pmtMethod': mop,
                'nxtDate': date,
                'nxtWork': nxtWork,

            })
                .then((response) => {
                    console.log("response:", response)
                    if (response.data === "Success") {

                        if(mop === 'Online')
                        {
                        navigate('/dashboard/payment', { replace: true });
                        }
                        else{
                            navigate('/dashboard/work', { replace: true });
                        }

                    }
                })
                .catch((e) => {
                    console.log("Error", e);
                })
    }

    useEffect(()=>{
        axios.post('http://localhost:5000/users/getWorkDetails',{'workId':workId})
        .then((res)=>{
            console.log("result",res);
            setName(res.data[0].cust_name);
            setServ(res.data[0].serv_name);
        })
        .catch((err)=>{
            console.log("error",err);
        })
    },[workId])


    const handleMopChange = (event) => {
        setMop(event.target.value);

    }

    const RegisterSchema = Yup.object().shape({
        
        amnt: Yup.string().required('Amount is required'),


    });

    const formik = useFormik({
        initialValues: {
            
            amnt: '',
            wd: '',
            nxtWork: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: () => {
            console.log('imag', amnt, wDetails);

            axios.post('http://localhost:5000/users/updateWork', {
                'workId': workId,

                'name': name,
                'serv': serv,
                'amnt': formik.values.amnt,
                'wDetails': formik.values.wd,
                'wrnt': grnt,
                'pmtMethod': mop,
                'nxtDate': date,
                'nxtWork': formik.values.nxtWork,

            })
                .then((response) => {
                    console.log("response:", response)
                    if (response.data === "Success") {
                        if(mop === 'Online')
                        {
                        navigate('/dashboard/payment', { replace: true });
                        }
                        else{
                            navigate('/dashboard/work', { replace: true });
                        }

                    }
                })
                .catch((e) => {
                    console.log("Error", e);
                })


        }


    });

    const { touched, errors, handleSubmit, getFieldProps } = formik;

    return (
        <Page title="Update Work">
            <Container>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Update Work done</Typography>
                </Box>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                value={name}
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
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
                                    disabled: true,
                                  }}
                                label="Service provided"
                                
                            />

                            <TextField
                                fullWidth
                                multiline
                                minRows='2'
                                type="text"
                                label="Work details"
                                value={wDetails}
                                onChange={(e) => setWDetails(e.target.value)}
                                {...getFieldProps('wd')}
                                error={Boolean(touched.wd && errors.wd)}
                                helperText={touched.wd && errors.wd}
                            />
                            <FormControl>
                                <InputLabel>Warranty</InputLabel>

                                <Select
                                    
                                    value={grnt}
                                    label="Warranty"
                                    onChange={(e) => setGrnt(e.target.value)}
                                >
                                    <MenuItem value={0}>Not Applicable</MenuItem>
                                    {numbers.map((s, i) =>
                                        <MenuItem key={i} index={i} value={s}>{s} Months</MenuItem>

                                    )}

                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                value={amnt}
                                onChange={(e) => {
                                    console.log('change')
                                    setAmnt(e.target.value)}}
                                label="Amount"
                                {...getFieldProps('amnt')}
                                error={Boolean(touched.amnt && errors.amnt)}
                                helperText={touched.amnt && errors.amnt}
                            />

                            <FormControl component="fieldset">
                                <FormLabel component="legend">Payment method</FormLabel>
                                <RadioGroup
                                    value={mop}
                                    onChange={(event) => handleMopChange(event)}
                                    name="radio-buttons-group"
                                >
                                    <Stack direction='row' spacing={2}>
                                    <FormControlLabel value="Online" control={<Radio />} label="Online Payment" />
                                    <FormControlLabel value="Cash" control={<Radio />} label="Cash Payment" />
                                    </Stack>

                                </RadioGroup>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Next Call"
                                    value={date}
                                    onChange={(newValue) => {
                                        console.log("date:", newValue);
                                        setDate(newValue);

                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>

                            <TextField
                                fullWidth
                                value={nxtWork}
                                onChange={(e) => setNxtWork(e.target.value)}
                                label="Next Work details"
                                {...getFieldProps('nxtWork')}
                                error={Boolean(touched.nxtWork && errors.nxtWork)}
                                helperText={touched.nxtWork && errors.nxtWork}
                            />

                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                
                            >
                                Save
                            </Button>

                        </Stack>
                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    );
}
