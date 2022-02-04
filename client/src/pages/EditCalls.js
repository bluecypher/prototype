import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, Link as RouterLink, useParams, useLocation } from 'react-router-dom';
// import { history } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Link, Container, Typography, Stack, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';
// components
import { changePrev } from '../actions/index';
import Page from '../components/Page';




export default function EditCalls() {
    const [selectedService, setSelectedService] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const { workId } = useParams();
    const [services, setServices] = useState([]);
    const [custList, setCustList] = useState([]);
    const [USERLIST, setUSERLIST] = useState([]);
    // const [redirect, setRedirect] = useState(false);
    const [cookies, setCookies] = useCookies();
    const id = useSelector((state) => state.profileReducer.id);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loc = useLocation();
    // const toCustomer = () => {

    //     navigate('/dashboard/customers');
    // }
    const history = useLocation();
    useEffect(() => {
        console.log("loc is", id)
        if (!Object.keys(cookies).length) {
            navigate('/sessionExpired')
        }
        else {

            axios.post('/users/getUserServices/', { 'id': id })
                .then((res) => {
                    console.log('services:', res.data);
                    setServices(res.data);
                })
                .catch((err) => {
                    console.log('err', err);
                })
            axios.post('/users/getCustomersList/', { 'id': id })
                .then((res) => {
                    console.log('customers:', res.data);
                    setCustList(res.data);
                })
                .catch((err) => {
                    console.log('err', err);
                })

            axios.post('/users/getWorkDetails', { 'workId': workId })
                .then((res) => {
                    console.log("work details", res);
                    setSelectedService(res.data[0].work_type);
                    if (res.data[0].assign_to) {
                        if(res.data[0].assign_to===id)
                        {
                            console.log('selmem',0);
                            setSelectedMember(0);
                        }
                        else
                        {
                            console.log('selmem',res.data[0].assign_to);
                            setSelectedMember(res.data[0].assign_to);
                        }
                        
                    }
                    setSelectedCustId(res.data[0].cust_mast_id);
                    setDate(new Date(res.data[0].work_plan_date));
                    setTime(new Date(res.data[0].work_plan_date));
                    // setName(res.data[0].cust_name);
                    // setServ(res.data[0].serv_name);
                    setTodo(res.data[0].work_desc);
                })
                .catch((err) => {
                    console.log("error", err);
                })
            axios.get('/users/getMembers', { params: { 'id': id } })
                .then((res) => {
                    console.log('get members:', res.data);
                    setUSERLIST(res.data);
                })
                .catch((err) => {
                    console.log('err', err);
                })
            dispatch(changePrev("editCalls"));
        }
    }, [id])

    const [selectedCustId, setSelectedCustId] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [todo, setTodo] = useState('');

    const onSave = () => {
        if (time) {
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
        }

        axios.post('/users/updateWork/', { 'custId': selectedCustId, 'spId': id, 'date': date, 'todos': todo, 'servId': selectedService, 'asgnTo': selectedMember, 'workId': workId })
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
        <Page title="Edit Calls">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Edit call</Typography>
                </Box>

                <Box sx={{ pb: 5 }} width={{ xs: '95%', sm: '50%' }}>
                    {/* { redirect?
                    
                <RouterLink to={{pathname:"/dashboard/customers", state: {prev: 'EditCalls'} }} />
                    :
                    <></>
                    } */}
                    <FormControl fullWidth>
                        <InputLabel>Select customer</InputLabel>

                        <Select

                            value={selectedCustId}
                            label="Select customer"
                            onChange={(e) => setSelectedCustId(e.target.value)}
                        >
                            {
                                custList.map((item, id) =>
                                    <MenuItem key={item.custId} value={item.custId}>{item.name}</MenuItem>
                                )

                            }
                            <Link component={RouterLink} to={{ pathname: "/dashboard/customers" }}>
                                {/* <Link onClick={()=>{console.log("click")}}>  */}
                                <MenuItem value="Add Customer">


                                    <Typography variant="subtitle2">+Add a new customer</Typography>

                                </MenuItem>
                            </Link>



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
                        <InputLabel>Assign to</InputLabel>

                        <Select

                            value={selectedMember}
                            label="Service Provided"
                            onChange={(e) => setSelectedMember(e.target.value)}
                        >
                            {USERLIST.map((s, i) =>
                                <MenuItem key={s.memberId} value={s.memberId}>{s.name}</MenuItem>

                            )}
                            <MenuItem value={0}>Self</MenuItem>

                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel>Service</InputLabel>

                        <Select

                            value={selectedService}
                            label="Service Provided"
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            {services.map((s, i) =>
                                <MenuItem key={s.serv_id} value={s.serv_id}>{s.serv_name}</MenuItem>

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