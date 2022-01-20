import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Box, Grid, Container, Typography, Stack, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';
// components
import Page from '../components/Page';




export default function AddCalls() {
    const [selectedService, setSelectedService] = useState("");
    const [services, setServices] = useState([]);
    const [custList, setCustList] = useState([]);
    const [cookies, setCookies] = useCookies();
    const id = useSelector((state) => state.profileReducer.id);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("id is", id)
        axios.post('http://localhost:5000/users/getCustomersList/', { 'id': id })
            .then((res) => {
                if (!Object.keys(cookies).length) {
                    navigate('/sessionExpired')
                }
                else {
                    console.log('res data:', res.data);
                    setCustList(res.data);

                }
            })
            .catch((err) => {
                console.log('err', err);
            })

        axios.post('http://localhost:5000/users/getUserServices/', { 'id': id })
            .then((res) => {
                if (!Object.keys(cookies).length) {
                    navigate('/sessionExpired')
                }
                else {
                    console.log('res data:', res.data);
                    setServices(res.data);

                }
            })
            .catch((err) => {
                console.log('err', err);
            })
    }, [id])

    const [selectedCustId, setSelectedCustId] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [todo, setTodo] = useState('');

    const onSave = () => {
        if(time)
        {
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
        }
        
        axios.post('http://localhost:5000/users/addWork/', { 'custId': selectedCustId, 'spId': id, 'date': date, 'todos': todo, 'servId':selectedService })
            .then((res) => {
                console.log("res:", res.data);
                if (res.data === "Success") {
                    navigate('/dashboard/work');
                }
            })
            .catch((err) => {
                console.log("Error", err)
            })
        console.log("clickks", date);
    }
    return (
        <Page title="Add Calls">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Add new calls</Typography>
                </Box>

                <Box sx={{ pb: 5 }} width={{ xs: '95%', sm: '50%' }}>
                    <FormControl fullWidth>
                        <InputLabel>Select customer</InputLabel>

                        <Select

                            value={selectedCustId}
                            label="Select customer"
                            onChange={(e) => setSelectedCustId(e.target.value)}
                        >
                            {
                                custList.map((item, id) =>
                                    <MenuItem index={item.custId} value={item.custId}>{item.name}</MenuItem>
                                )

                            }



                        </Select>
                    </FormControl>
                </Box>
                <Stack width={{ xs: '95%', sm: "50%" }} spacing={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Date"
                            value={date}
                            onChange={(newValue) => {
                                console.log("date:", newValue);
                                setDate(newValue);

                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        
                        <TimePicker
                            label="Select Time(Optional)"
                            inputVariant="outlined"
                            value={time}
                            onChange={(newValue) => {


                                console.log("date:", newValue);
                                setTime(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        
                    </LocalizationProvider>

                    <FormControl>
                        <InputLabel>Service</InputLabel>

                        <Select

                            value={selectedService}
                            label="Service Provided"
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            {services.map((s, i) =>
                                <MenuItem index={s.serv_id} value={s.serv_id}>{s.serv_name}</MenuItem>

                            )}

                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        minRows='2'
                        type="text"
                        label="To Dos"
                        value={todo}
                        onChange={(event) => { setTodo(event.target.value) }}

                    />

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={onSave}
                    >
                        Save
                    </Button>
                </Stack>

            </Container>
        </Page>

    );
}