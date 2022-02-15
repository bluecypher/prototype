import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
// import plusFill from '@iconify/icons-eva/plus-fill';
import {
    Box,
    Container,
    Typography,
    Stack,
    Button,
    Modal,
    Alert,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import DatePicker from '@mui/lab/MobileDatePicker';
import TimePicker from '@mui/lab/MobileTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Icon } from '@iconify/react';
import close from '@iconify/icons-ant-design/close-circle-outlined';
import axios from 'axios';

// components
import Page from '../components/Page';

export default function AddCalls() {
    const [selectedService, setSelectedService] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [services, setServices] = useState([]);
    const [custList, setCustList] = useState([]);
    const [USERLIST, setUSERLIST] = useState([]);
    const [cookies, setCookies] = useCookies();
    const [showAdd, setShowAdd] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const id = useSelector((state) => state.profileReducer.id);
    const navigate = useNavigate();
    const AddSchema = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),

        phone: Yup.number('Mobile number must be numeric.')
            .min(1000000000, 'Please enter a valid number.')
            .required('Number is required')
            .typeError('Mobile number must be numeric.')
    });
    useEffect(() => {
        // console.log("id is", id)
        if (!Object.keys(cookies).length) {
            navigate('/sessionExpired');
        } else {
            axios
                .post('/users/getUserServices/', { id: id })
                .then((res) => {
                    // console.log('services:', res.data);
                    if (res.data) setServices(res.data);
                })
                .catch((err) => {
                    console.log('err', err);
                });
            axios
                .post('/users/getCustomersList/', { id: id })
                .then((res) => {
                    // console.log('customers:', res.data, 'fssd');
                    if (res.data.length) {
                        console.log('customerssd:', res.data);
                        setCustList(res.data);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                });
            axios
                .get('/users/getMembers', { params: { id: id } })
                .then((res) => {
                    // console.log('get members:', res.data);
                    if (res.data) setUSERLIST(res.data);
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }, [id, refresh]);

    const [selectedCustId, setSelectedCustId] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [todo, setTodo] = useState('');
    const handleNewMember = () => {
        // console.log('filtered:',filteredUsers)
        if (showAdd) {
            setShowAdd(false);
            setError(false);
            setSuccess(false);
        } else {
            setShowAdd(true);
            setError(false);
            setSuccess(false);
            formik2.values.name = '';
            formik2.values.phone = '';
            formik2.values.address = '';
        }
    };

    const onSave = () => {
        if (time) {
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
        }

        axios
            .post('/users/addWork/', {
                custId: selectedCustId,
                spId: id,
                date: date,
                todos: todo,
                servId: selectedService,
                asgnTo: selectedMember
            })
            .then((res) => {
                console.log('res:', res.data);
                if (res.data === 'Success') {
                    navigate('/dashboard/work');
                }
            })
            .catch((err) => {
                console.log('Error', err);
            });
        console.log('clickks', date);
    };

    const onCancel = () => {
        navigate('/dashboard/work');
        console.log('cancel');
    };

    const formik2 = useFormik({
        initialValues: {
            name: '',
            phone: '',
            address: ''
        },
        validationSchema: AddSchema,
        onSubmit: () => {
            // console.log('imag', formik.values.name);
            axios
                .post('/users/addCustomers', {
                    number: formik2.values.phone,
                    id: id,
                    name: formik2.values.name,
                    add: formik2.values.address
                })
                .then((res) => {
                    console.log(res);
                    if (res.data === 'Success') {
                        // setNumber('');
                        formik2.values.name = '';
                        formik2.values.phone = '';
                        formik2.values.address = '';

                        setRefresh(true);
                        setRefresh(false);
                        setError(false);
                        setSuccess(true);
                    } else if (res.data.code === 'ER_DUP_ENTRY') {
                        setSuccess(false);
                        setError(true);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    });

    const { touched, errors, isSubmitting, handleSubmit, getFieldProps } = formik2;

    return (
        <Page title="Add Calls">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Add New Calls</Typography>
                </Box>
                <Modal open={showAdd} onClose={handleNewMember}>
                    <Card
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',

                            p: 3
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6" gutterBottom>
                                Add a new Customer
                            </Typography>
                            <Icon color="red" onClick={handleNewMember} icon={close} width={24} height={24} />
                        </Stack>
                        <FormikProvider value={formik2}>
                            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <TextField
                                        inputProps={{ maxLength: 10 }}
                                        label="Phone number"
                                        // value={number}
                                        // onChange={handleNumber}
                                        size="small"
                                        {...getFieldProps('phone')}
                                        error={Boolean(touched.phone && errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                    />
                                    <TextField
                                        inputProps={{ maxLength: 40 }}
                                        label="Name"
                                        size="small"
                                        // value={cName}
                                        // onChange={handleCName}
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />

                                    <TextField
                                        inputProps={{ maxLength: 60 }}
                                        label="Address"
                                        size="small"
                                        // value={add}
                                        // onChange={handleAdd}
                                        {...getFieldProps('address')}
                                        error={Boolean(touched.address && errors.address)}
                                        helperText={touched.address && errors.address}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ width: '20%', alignSelf: 'center' }}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                            </Form>
                        </FormikProvider>

                        {error && (
                            <Stack m={2}>
                                <Alert severity="error">
                                    A Customer with same number already exist in your list!!
                                </Alert>
                            </Stack>
                        )}
                        {success && (
                            <Stack m={2}>
                                <Alert severity="success">Customer added successfully!</Alert>
                            </Stack>
                        )}
                    </Card>
                </Modal>

                <Box sx={{ pb: 5 }} width={{ xs: '95%', sm: '50%' }}>
                    <FormControl fullWidth>
                        <InputLabel>Select customer</InputLabel>

                        <Select
                            value={selectedCustId}
                            label="Select customer"
                            onChange={(e) => setSelectedCustId(e.target.value)}
                        >
                            {custList.map((item, id) => (
                                <MenuItem key={item.custId} value={item.custId}>
                                    {item.name}
                                </MenuItem>
                            ))}
                            <Button onClick={handleNewMember}>
                                <Typography variant="subtitle2">+Add a new customer</Typography>
                            </Button>
                        </Select>
                    </FormControl>
                </Box>
                <Stack width={{ xs: '95%', sm: '50%' }} spacing={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Date"
                            value={date}
                            onChange={(newValue) => {
                                console.log('date:', newValue);
                                setDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="dd/MM/yyyy"
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Select Time(Optional)"
                            inputVariant="outlined"
                            value={time}
                            onChange={(newValue) => {
                                console.log('date:', newValue);
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
                            {USERLIST.map((s, i) => (
                                <MenuItem key={s.memberId} value={s.memberId}>
                                    {s.name}
                                </MenuItem>
                            ))}
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
                            {services.map((s, i) => (
                                <MenuItem key={s.serv_id} value={s.serv_id}>
                                    {s.serv_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        minRows="2"
                        type="text"
                        label="To Dos"
                        value={todo}
                        onChange={(event) => {
                            setTodo(event.target.value);
                        }}
                    />

                    <Button fullWidth size="large" type="submit" variant="contained" onClick={onSave}>
                        Save
                    </Button>

                    <Button variant="outlined" color="error" sx={{ border: 1.5 }} onClick={onCancel}>
                        Cancel
                    </Button>
                </Stack>
            </Container>
        </Page>
    );
}
