import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import firebase from "firebase/compat/app";


import "firebase/compat/messaging";

import { useFormik, Form, FormikProvider } from 'formik';
import { useCookies } from 'react-cookie';
// import PWAInstallerPrompt from 'react-pwa-installer-prompt';
// material

import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Avatar,
  CardActionArea,
  Alert,
  TextField,
  Modal,
  Button,
  CardHeader
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import { firebaseConfig } from "../utils/pushNotification"


// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
// import InstallPrompt from '../components/InstallPrompt';
import useIosInstallPrompt from '../app/shared/hooks/useIosInstallPrompt';
import useWebInstallPrompt from '../app/shared/hooks/useWebInstallPrompt';
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
// import { LoginForm } from '../components/authentication/login';
// import AuthSocial from '../components/authentication/AuthSocial';

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

export default function Login() {


  const askForPermissionToReceiveNotifications = async (messaging) => {
    try {


      messaging.getToken({ vapidKey: 'BOtVSIcvlmR7eGLUd321oqBBH_l-kX5hVwvBCqhuG120mrk8Dk0nLXu1kEHeFG4kSR2CxnmjFKTKMKvrToz6s1c' }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...

          // send the token to backend for with corresponding user id
          console.log(currentToken)
          localStorage.setItem('pToken', currentToken);
          // axios.post('/users/saveToken',{ token: currentToken }).then(res => {
          //     console.log(res);
          //   }).catch(err => {
          //     console.log(err);
          //   })

          // axios.post('/users/sendNotification', { token: currentToken }).then(res => {
          //   console.log(res);
          // }).catch(err => {
          //   console.log(err);
          // })

          // from server get token of team member to be added and then post request to the destination token



        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    } catch (error) {
      console.error(error);
    }
  }

  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();


  const prevData = JSON.parse(localStorage.getItem('prev_user'));

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [encPin, setEncPin] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [error, setError] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  // const [supported, setSupported] = useState(false);

  const [cookies, setCookie] = useCookies('');
  const [tmplt, setTmplt] = useState('');
  const data = useSelector((state) => state.profileReducer);
  const LoginSchema = Yup.object().shape({
    number: Yup.number('Mobile number must be numeric.')
      .min(1000000000, 'Too Short. Please enter a valid number.')
      .required('Mobile number is required')
    // password: Yup.string().required('OTP is required')
  });
  const handleSubmit2 = () => {
    if (inputOtp === "123456") {
      localStorage.setItem('number', values.number);
      navigate('/setPin', { replace: true });

    } else {
      setError(true);
      console.log('less than 6');
    }
  };

  const handleSubmit3 = () => {
    const bytes = CryptoJS.AES.decrypt(encPin, 'sahayak2');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log('dec', inputPin);
    if (originalText === inputPin) {
      axios
        .post(
          '/users/login',
          {
            number: values.number
          },
          {
            'access-control-allow-origin': '*'
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.res === 'success') {
            localStorage.setItem('number', values.number);
            setCookie('token', response.data.jwToken, {
              path: '/',
              expires: new Date(Date.now() + 1000 * 3600 * 24 * 7)
            });

            if (response.data.status === 'F') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/register', { replace: true });
            }
          }
        })
        .catch((e) => {
          console.log('Error', e);
        });
    }
    else {
      setPinError(true);
    }

  }

  useEffect(() => {
    console.log("useEfet")
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();
    askForPermissionToReceiveNotifications(messaging);
    if (webInstallPrompt || iosInstallPrompt) {
      setShowInstall(true);
    }
    if (cookies.token && data.number) {
      navigate('/dashboard', { replace: true });
    }
  }, [data, webInstallPrompt, iosInstallPrompt]);

  const formik = useFormik({
    initialValues: {
      number: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      // console.log(event);

      //   const props = ['name', 'email', 'tel', 'address', 'icon'];
      // const opts = { multiple: true };
      //   navigator.contacts.select(props, opts).then((contacts)=>{
      //     console.log('results:',contacts);
      //   })

      //   .catch ((ex)=> {
      //   console.log('err',ex);
      // })

      axios.post('/users/getLogin', { number: values.number }).then((res) => {
        console.log('getlogin', res);
        if (res.data.password === null) {

          // const bytes = CryptoJS.AES.decrypt(res.data.otp, 'sahayak2');
          // const originalText = bytes.toString(CryptoJS.enc.Utf8);
          // setOTP(originalText);
          setShowOTP(true);
        }
        else {
          setShowPIN(true);
          setEncPin(res.data.password);
        }
      })
        .catch((err) => {
          console.log('err', err);
        })


    }
  });
  const handleInstallClick = () => {
    setShowInstall(false);
    handleWebInstallAccepted();
  }
  const handleWebCloseClick = () => {
    setShowInstall(false);
    handleWebInstallDeclined();
  }
  const handleIosCloseClick = () => {
    setShowInstall(false);
    handleIOSInstallDeclined();
  }
  const profileClick = () => {
    formik.setFieldValue('number', prevData.number).then((res) => {
      if (!showOTP) formik.handleSubmit();
    });
  };
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
        <Modal open={showInstall}>
          <Card sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            justifyContent: 'center',
            alignItems: 'center',
            p: 1
          }}>
            <Stack sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32 }} src="/static/logo.png" alt="sahayak" />
            </Stack>

            <CardHeader sx={{ py: 1, alignItems: 'center' }} title="Would you like to install Sahayaks App?" />
            {iosInstallPrompt && (
              <Stack sx={{ alignItems: 'center', }} spacing={2}>
                <Typography variant="subtitle2">
                  Tap
                  share <Icon icon="fluent:share-ios-20-regular" width={22} height={22} />
                  then &quot;Add to Home Screen&quot;
                </Typography>

                <Button onClick={handleIosCloseClick}>Close</Button>

              </Stack>
            )}
            {webInstallPrompt && (
              // <Stack sx={{alignItems:'center', }}>
              <Stack sx={{ alignItems: 'center', justifyContent: 'space-around', mt: 5 }} direction="row">

                <Button color="error" variant="outlined" onClick={handleWebCloseClick}>Close</Button>
                <Button variant="contained" color="primary" onClick={handleInstallClick}>
                  Install
                </Button>
              </Stack>
              // </Stack>
            )}

          </Card>
        </Modal>
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Stack sx={{ mb: 5 }} alignItems="center">





              {prevData && (
                <Card sx={{ maxWidth: 345, p: 1, boxShadow: 10, minWidth: 100 }}>
                  <CardActionArea onClick={profileClick}>
                    <Stack spacing={1} alignItems="center">
                      <Stack alignItems="center">
                        {prevData.image ? (
                          <Avatar
                            src={prevData.image}
                            sx={{ width: 50, height: 50, alignSelf: 'center', border: 2 }}
                            alt="photoURL"
                          />
                        ) : (
                          <Avatar
                            sx={{ width: 50, height: 50, alignSelf: 'center' }}
                            alt="photoURL"
                          />
                        )}
                      </Stack>

                      <Typography variant="subtitle2">{prevData.name}</Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              )}
            </Stack>
            {/* <Link href={`whatsapp://send?phone=+91${formik.values.number}`}>calls</Link> */}
            <Typography variant="h4" gutterBottom>
              Log in
            </Typography>
            {/* <PWAInstallerPrompt
              render={({ onClick }) => (
                <Button type="submit" onClick={onClick}> 
                  Install
                </Button>
              )}
              callback={(data) => console.log(data)}
            /> */}
            <Typography sx={{ color: 'text.secondary' }}>
              Please enter your Mobile Number.
            </Typography>

          </Stack>

          {/* <LoginForm /> */}
          <Stack spacing={3}>
            <FormikProvider value={formik}>
              <Form id="myForm" autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    label="Mobile number"
                    {...getFieldProps('number')}
                    error={Boolean(touched.number && errors.number)}
                    helperText={touched.number && errors.number}
                  />
                  {/* <a href="tel:7070024384">7070024384</a> */}
                  {/* <Link href={`tel:${call}`} >call</Link> */}

                  <LoadingButton
                    id="otp"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={showOTP || showPIN}
                  // loading={isSubmitting}
                  >
                    Next
                  </LoadingButton>
                  {/* <Button
                    fullWidth

                    variant="contained"
                    onClick={() => {
                      setShowInstall(true)
                      console.log('click')
                    }
                    }
                  >Install</Button> */}
                </Stack>
              </Form>
            </FormikProvider>
            {showOTP && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="OTP"
                  // {...getFieldProps('password')}
                  inputProps={{
                    maxLength: 6
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton onClick={handleShowPassword} edge="end">
                    //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    //     </IconButton>
                    //   </InputAdornment>
                    // )
                  }}
                  value={inputOtp}
                  onChange={(event) => setInputOtp(event.target.value)}

                // error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
                />
                {error && (
                  <Stack m={2}>
                    <Alert severity="error">OTP does not match!</Alert>
                  </Stack>
                )}

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
                  {/* <FormControlLabel
      control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
      label="Remember me"
    /> */}

                  {/* <Link component={RouterLink} variant="subtitle2" to="#">
                    Resend OTP?
                  </Link> */}
                </Stack>

                <LoadingButton
                  id="signin"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit2}
                // loading={isSubmitting}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            )}
            {showPIN && (
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="PIN"
                  // {...getFieldProps('password')}
                  inputProps={{
                    maxLength: 6
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton onClick={handleShowPassword} edge="end">
                    //       <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    //     </IconButton>
                    //   </InputAdornment>
                    // )
                  }}
                  value={inputPin}
                  onChange={(event) => setInputPin(event.target.value)}

                // error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
                />

                {pinError && (
                  <Stack m={2}>
                    <Alert severity="error">Wrong PIN!</Alert>
                  </Stack>
                )}

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
                  {/* <FormControlLabel
      control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
      label="Remember me"
    /> */}

                  <Link component={RouterLink} variant="subtitle2" to="/forgotPin">
                    Forgot PIN?
                  </Link>
                </Stack>

                <LoadingButton
                  id="signin"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit3}
                // loading={isSubmitting}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </ContentStyle>
      </Container>

      {/* <MHidden width="mdDown">
  <SectionStyle>
    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
    नमस्ते, वापस स्वागत है
    </Typography>
    <img src="/static/illustrations/illustration_login.png" alt="login" />
  </SectionStyle>
</MHidden>

<Container maxWidth="sm">
  <ContentStyle>
    <Stack sx={{ mb: 5 }}>
      <Typography variant="h4" gutterBottom>
      लॉग इन करें
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>नीचे अपना विवरण दर्ज करें।</Typography>
    </Stack>
    

    <LoginForm />

  
  </ContentStyle>
</Container> */}
    </RootStyle>
  );
}
