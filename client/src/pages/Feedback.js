import { React, useState, useEffect } from 'react';

import { Box, Button, Link, Container, Grid, Typography, Rating, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
// import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import Page from '../components/Page';

// const CryptoJS = require("crypto-js");

const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(15)
}));

export default function Feedback() {
    const navigate = useNavigate();
    const { ciphertext } = useParams();
    const [value, setValue] = useState(0);
    const [complaint, setComplaint] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [name, setName] = useState('');
    const [workId, setWorkId] = useState('');
    const [serv, setServ] = useState('');
    const [error, setError] = useState('');
    const [spName, setSPName] = useState('');

    const [devices, setDevices] = useState('');

    const [selected, setSelected] = useState([]);


    const handleCheck = (e, id) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        console.log('jejr', newSelected);
        setSelected(newSelected);
    }

    const handleSubmit = (e) => {

        console.log('ad', JSON.stringify(selected));

        axios.post('/users/postFeedback', { "selected": JSON.stringify(selected), "workId": workId, "rating": value, "flag": selected.includes(8) ? 'N' : 'C' }).then((res) => {
            console.log(res);
            if (res.data === "success") {
                console.log("success");
                navigate('/submitFeedback');
            }
        }).catch((err) => {
            console.log("error", err);
        })
    }

    useEffect(() => {
        // console.log(workId);
        const originalText = Buffer.from(ciphertext, "base64").toString();

        setWorkId(originalText);
        console.log('original', originalText);
        axios
            .post('/users/getWorkDetails', { workId: originalText })
            .then((res) => {
                console.log('result', res);
                setName(res.data[0].cust_name);
                setServ(res.data[0].serv_name);

                setSPName(res.data[0].first_name);
            })
            .catch((err) => {
                console.log('error', err);
            });

        axios
            .get('/users/getComplaints')
            .then((res) => {
                console.log('sdf', res.data)
                const arr = res.data;
                const comp = arr.filter((item) => item.type === 'c');
                const feed = arr.filter((item) => item.type === 'f');
                setComplaint(comp);
                setFeedback(feed);

                axios
                    .post('/users/getFeedbacks', { workId: originalText })
                    .then((res) => {
                        console.log('sdf', res.data)
                        const fnc = JSON.parse(res.data[0].feedback);
                        console.log('fnc', fnc);
                        if (fnc)
                            setSelected(fnc);
                        setValue(res.data[0].rating);
                        // setSelected(res.)

                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }, [ciphertext]);

    return (
        // <RootStyle title="Feedback">
            <Page title="Feedback">
            <Container>
                <Stack sx={{ mb:2, mt:4}}>

                    <Typography>
                        Dear Customer,
                        <br /><br />
                        Your {serv} was completed by {spName} Sahayak. <br /><br />
                        How would you rate our services.
                    </Typography>

                    <Box sx={{
                        width: '500',
                        mb: 2
                    }}>
                        <br />
                        < Rating
                            name="simple-controlled"
                            size="large"
                            value={value}
                            icon={<Icon icon="emojione:star" width={55} height={55} />}
                            emptyIcon={<Icon icon="el:star-empty" width={53} height={53} />}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        />

                    </Box>


                    <Typography>We would like to hear more from you.</Typography>



                    <Box maxWidth="xl" sx={{ m: 1, my: 2, width: "100%" }} >
                        <br />
                        <Grid container spacing={1}>
                            {
                                feedback.map((item) =>
                                    selected.indexOf(item.id) === -1 ?
                                        <Grid key={item.id} sx={{ mb: 1 }} item xs={6}>
                                            <Button fullWidth onClick={(event) => handleCheck(event, item.id)} variant="outlined">
                                                {item.desc}
                                            </Button>
                                        </Grid>
                                        :
                                        <Grid key={item.id} sx={{ mb: 1 }} item xs={6}>
                                            <Button fullWidth onClick={(event) => handleCheck(event, item.id)} variant="contained" >
                                                {item.desc}
                                            </Button>
                                        </Grid>
                                )
                            }
                        </Grid>
                        <br />
                        <br />
                        <Typography>We would like to hear your feedback and concerns.</Typography>
                        <br />
                        <br />
                        <Grid container spacing={1}>
                            {
                                complaint.map((item) =>
                                    selected.indexOf(item.id) === -1 ?
                                        <Grid key={item.id} sx={{ mb: 1 }} item xs={6}>
                                            <Button fullWidth onClick={(event) => handleCheck(event, item.id)} variant="outlined">
                                                {item.desc}
                                            </Button>
                                        </Grid>
                                        :
                                        <Grid key={item.id} sx={{ mb: 1 }} item xs={6}>
                                            <Button fullWidth onClick={(event) => handleCheck(event, item.id)} variant="contained" >
                                                {item.desc}
                                            </Button>
                                        </Grid>
                                )
                            }
                        </Grid>

                    </Box>
                    <Button size="large" onClick={(event) => handleSubmit(event)} variant="contained" >
                        Submit
                    </Button>

                </Stack>
            </Container>
           
        {/* </RootStyle > */}
        </Page>
    );
}


