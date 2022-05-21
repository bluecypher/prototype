import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// import { useCookies } from 'react-cookie';
// import PWAInstallerPrompt from 'react-pwa-installer-prompt';
// material

import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Container,
  Typography,

  Alert,
  TextField,

} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';


const axios = require('axios');
const CryptoJS = require("crypto-js");
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',

  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function SetPin() {
    const navigate = useNavigate();
  const [error, setError] = useState(false);
//   const data = useSelector((state) => state.profileReducer);
  const LoginSchema = Yup.object().shape({
    pin: Yup.number('PIN must be numeric.')
      .min(100000, 'Too Short. Please enter a valid PIN.')
      .required('PIN is required'),
    pin2: Yup.number('PIN must be numeric.')
      .min(100000, 'Too Short. Please enter a valid PIN.')
      .required('PIN is required')
      .oneOf([Yup.ref('pin'),null], "PINs do not match")
    //   .test(
    //         "PINs do not match",
    //         () => values.pin !== values.pin2
    //   )
    // password: Yup.string().required('OTP is required')
  });

 

//   useEffect(() => {
    
//     if (cookies.token && data.number) {
//       navigate('/dashboard', { replace: true });
//     }
//   }, [data]);

  const formik = useFormik({
    initialValues: {
      
      pin: '',
      pin2: '',
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
    
    const ciphertext = CryptoJS.AES.encrypt(values.pin, 'sahayak2').toString();
    console.log('cipher',ciphertext);
    

    axios.post('/users/setPIN', { pin: ciphertext, number: localStorage.getItem('number') }).then((res) => {
      console.log('setPIN', res.data);
      if(res.data === "Success")
      {
          navigate('/login');
      }
      })
      .catch((err) => {
        console.log('err', err);
      })

      
    }
  });
 
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <RootStyle title="Login">
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hello, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            

            <Typography variant="h4" gutterBottom>
              Set PIN
            </Typography>
            
            <Typography sx={{ color: 'text.secondary' }}>
              Please create a six digit PIN of your choice.
            </Typography>

          </Stack>

          {/* <LoginForm /> */}
          <Stack spacing={3}>
            <FormikProvider value={formik}>
              <Form id="myForm" autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type='password'
                    inputProps={{ maxLength: 6 }}
                    label="PIN"
                    {...getFieldProps('pin')}
                    error={Boolean(touched.pin && errors.pin)}
                    helperText={touched.pin && errors.pin}
                  />
                  {/* <a href="tel:7070024384">7070024384</a> */}
                  {/* <Link href={`tel:${call}`} >call</Link> */}
                  <TextField
                    fullWidth
                    type='password'
                    inputProps={{ maxLength: 6 }}
                    label="Re-Enter PIN"
                    {...getFieldProps('pin2')}
                    error={Boolean(touched.pin2 && errors.pin2)}
                    helperText={touched.pin2 && errors.pin2}
                  />
                  <LoadingButton
                    id="otp"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    
                  // loading={isSubmitting}
                  >
                    Create PIN
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
            
                {error && (
                  <Stack m={2}>
                    <Alert severity="error">PINs does not match!</Alert>
                  </Stack>
                )}
          </Stack>
        </ContentStyle>
      </Container>

    </RootStyle>
  );
}
